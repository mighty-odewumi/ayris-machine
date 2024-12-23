import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PostForm from '@/components/PostForm'

export default async function WritePage() {
  const supabase = createClient()
  
  // const { data: { user } } = await supabase.auth.getUser()
  
  // if (!user) {
  //   // If the user is not logged in, redirect to the login page
  //   // You may need to adjust this path to match your login page route
  //   redirect('/login')
  // }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Write a New Post</h1>
      <PostForm />
    </div>
  )
}

