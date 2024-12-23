import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function Post({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('id', params.id)
    .single()

  if (error || !post) {
    console.error(error)
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
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
    </div>
  )
}
