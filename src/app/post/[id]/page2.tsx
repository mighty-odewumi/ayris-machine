import { createClient } from '@/utils/supabase/server'
// import { notFound } from 'next/navigation'
// import Link from 'next/link'
// import Image from 'next/image'

export default async function Post({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;

  console.log('Fetching post with id:', id)

  // Add these console logs
  const { data: debugPost } = await supabase
  .from('posts')
  .select('id, profile_id')
  .eq('id', id)
  .single()
  console.log('Debug post:', debugPost)

  // Then try fetching a profile directly using the profile_id
  if (debugPost?.profile_id) {
    const { data: debugProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', debugPost.profile_id)
      .single()
    console.log('Debug profile:', debugProfile)
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)

  console.log('Profiles test:', profiles, profilesError)

  // const { data: post, error } = await supabase
  // .from('posts')
  // .select('*')
  // .eq('id', id)
  // .single()
  // const { data: post, error } = await supabase
  //   .from('posts')
  //   .select('*, profiles:profile_id(full_name, avatar_url)')
  //   .eq('id', id)
  //   .single()

  // console.log('Fetched post:', post)
  // console.log('Error:', error)

  // if (error) {
  //   console.error('Error fetching post:', error)
  //   throw new Error(`Failed to fetch post: ${error.message}`)
  // }

  // if (!data) {
  //   console.log('Post not found')
  //   notFound()
  // }

  return (
    <>
    hello
    {/* <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
      <div className="flex items-center mb-4 text-sm text-gray-500">
        <Image 
          src={post.profiles.avatar_url || '/placeholder.svg?height=32&width=32'} 
          alt={post.profiles.full_name} 
          className="w-8 h-8 rounded-full mr-2"
        />
        <span>{post.profiles.full_name}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <Link href={`/category/${post.category.toLowerCase()}`} className="text-indigo-400 hover:underline">
          {post.category}
        </Link>
      </div>
      <div className="prose prose-invert">
        {post.content.split('\n').map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div> */}

    </>
  )
}
