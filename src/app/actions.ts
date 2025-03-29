'use server'

import { createClient } from '@/utils/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitPost(formData: FormData) {
  try {
    const cookieStore = await cookies()

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
              console.error('Cookie setting error:', error)
            }
          }
        }
      }
    )

    const title = formData.get('title')?.toString()
    const content = formData.get('content')?.toString()
    
    if (!title || !content) {
      throw new Error('Title and content are required fields')
    }
    
    // Parse the categories JSON string
    let selectedCategoriesData: { id: string; name: string; group: string }[] = []
    try {
      const categoriesJSON = formData.get('categoriesData')?.toString()
      if (categoriesJSON) {
        selectedCategoriesData = JSON.parse(categoriesJSON)
        console.log('Parsed categories data:', selectedCategoriesData)
      } else {
        console.log('No categories data provided in form')
      }
    } catch (error) {
      console.error('Failed to parse category data JSON:', error)
    }
    
    // Extract just the IDs for backward compatibility
    const selectedCategories = selectedCategoriesData.map(cat => cat.id)

    // Check for authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Authentication error:', userError)
      throw new Error(`Authentication failed: ${userError.message}`)
    }
    
    const user = userData.user
    if (!user) {
      throw new Error('Authentication required - no user found')
    }

    // Handle file upload if an image was provided
    let imageUrl = null
    const imageFile = formData.get('image')
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        console.log('Uploading image:', { fileName, fileSize: imageFile.size })
        
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, imageFile)
          
        if (uploadError) {
          console.error('Image upload error:', uploadError)
          // Continue without image rather than failing the whole submission
        } else {
          const { data } = await supabase.storage
            .from('post-images')
            .getPublicUrl(fileName)
          imageUrl = data.publicUrl
          console.log('Image uploaded successfully:', imageUrl)
        }
      } catch (uploadError) {
        console.error('Image upload exception:', uploadError)
        // Continue without image
      }
    }

    // Set primary category data for the posts table
    const primaryCategory = selectedCategories.length > 0 ? selectedCategoriesData[0].id : 'default-category'
    const primaryCategoryGroup = selectedCategoriesData.length > 0 ? selectedCategoriesData[0].group : null
    
    console.log('Creating post with data:', { 
      title, 
      contentLength: content?.length, 
      user_id: user.id,
      primaryCategory,
      primaryCategoryGroup,
      hasImage: !!imageUrl 
    })

    // Insert the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        user_id: user.id,
        image_url: imageUrl,
        category: primaryCategory,
        category_group: primaryCategoryGroup
      })
      .select()
      .single()

    if (postError) {
      console.error('Post creation error:', postError)
      throw new Error(`Failed to create post: ${postError.message}`)
    }
    
    console.log('Post created successfully:', post.id)

   
  // Insert into posts_categories table for each selected category
    if (selectedCategoriesData.length > 0) {
      try {

        // Remove duplicate categories by creating a Set based on category_id
        const uniqueCategories = Array.from(
          new Map(selectedCategoriesData.map(item => [item.id, item])).values()
        );
        const categoryInserts = uniqueCategories.map(category => ({
          post_id: post.id,
          category_id: category.id,
          category_name: category.name,
          category_group: category.group
        }))
        
        console.log('Inserting categories:', JSON.stringify(categoryInserts, null, 2))
        
        const { data: insertedCategories, error: categoryError } = await supabase
          .from('posts_categories')
          .insert(categoryInserts)
          .select() // Add this to get back the inserted data
      
        if (categoryError) {
          console.error('Category association error:', categoryError)
          console.error('Error details:', JSON.stringify(categoryError, null, 2))
        } else {
          console.log('Categories associated successfully:', insertedCategories?.length || 0)
          console.log('Inserted category data:', JSON.stringify(insertedCategories, null, 2))
        }
      } catch (catInsertError) {
        console.error('Exception during category insertion:', catInsertError)
      }

    }
    // Success! Revalidate and redirect
    revalidatePath('/')
    console.log('Post created successfully, redirecting...')
    return { success: true, postId: post.id }

  } catch (error) {
    // Catch any uncaught errors in the process
    console.error('Post submission failed:', error)
    if (error instanceof Error) {
      throw new Error(`Post submission error: ${error.message}, ${error}`)
    } else {
      throw new Error('An unknown error occurred during post submission')
    }
  }
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
