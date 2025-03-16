import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PostForm from '@/components/PostForm'

export default async function WritePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <PostForm />
    </div>
  )
}

