'use server'

import { createClient } from '@/utils/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitPost(formData: FormData) {
  // Get the cookie store synchronously
  const cookieStore = await cookies()

  // Create a custom cookies object for Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // In a Server Component, set may not be available.
          }
        }
      }
    }
  )

  // Now you can proceed with your submission logic.
  const title = formData.get('title')?.toString()
  const content = formData.get('content')?.toString()
  const categoriesStr = formData.get('categories')?.toString() || ''
  const selectedCategories = categoriesStr.split(',').filter(Boolean)

  if (!title || !content) {
    throw new Error('Title and content are required.')
  }

  // Check for authenticated user
  const {
    data: { user }
  } = await supabase.auth.getUser()
  console.log(user);
  if (!user) {
    throw new Error('Authentication required')
  }

  // (Optional) Handle file upload if an image was provided.
  let imageUrl = null
  const imageFile = formData.get('image')
  if (imageFile instanceof File) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, imageFile)
    if (uploadError) throw uploadError

    const { data } = await supabase.storage
      .from('post-images')
      .getPublicUrl(fileName)
    imageUrl = data.publicUrl
  }

  console.log({ title, content, user_id: user.id, imageUrl })

  const primaryCategory = selectedCategories[0] || 'default-category'; // fallback if none selected

  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      user_id: user.id,
      image_url: imageUrl,
      category: primaryCategory  // Provide the required category value
    })
    .select()
    .single()


  if (postError) throw postError

  // Insert into posts_categories table for each selected category
  if (selectedCategories.length > 0) {
    const { error: categoryError } = await supabase
      .from('posts_categories')
      .insert(selectedCategories.map(categoryId => ({
        post_id: post.id,
        category_id: categoryId
      })))
    if (categoryError) throw categoryError
  }

  // Optionally revalidate cache and redirect
  revalidatePath('/')
  redirect(`/post/${post.id}`)
}


export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error);
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error);
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/register2')
}
