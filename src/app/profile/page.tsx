import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import AccountForm from './account-form'
import Link from 'next/link'

export default async function Profile() {
  const cookieStore = cookies()
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-4">
      <AccountForm user={user} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Your Posts</h2>
        {error && <p className="text-red-500">Error loading posts</p>}
        {posts && posts.length === 0 && <p className="text-gray-400">You haven't created any posts yet.</p>}
        <div className="space-y-4">
          {posts && posts.map(post => (
            <div key={post.id} className="border border-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-white">
                <Link href={`/post/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="text-gray-400 mb-2">{post.content.substring(0, 150)}...</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <Link href={`/category/${post.category.toLowerCase()}`} className="text-indigo-400 hover:underline">
                  {post.category}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
