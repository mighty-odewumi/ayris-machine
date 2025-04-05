import Image from 'next/image'
import Link from 'next/link'
import { Post } from '@/types/post'
import { deduplicateCategories, formatCategoryName } from '@/utils/categoryUtils'
import CategoryBadge from './CategoryBadge'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  // Deduplicate categories and format names
  const categories = deduplicateCategories(post.categories)
    .map(category => ({
      id: category.id,
      name: formatCategoryName(category.name)
    }))
    .filter(category => category.name) // Filter out null names

  return (
    <Link href={`/post/${post.id}`} className="block">
      <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white h-full">
        {post.image_url && (
          <div className="relative h-48">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(category => (
              <CategoryBadge 
                key={category.id}
                name={category.name}
              />
            ))}
          </div>

          <time 
            className="text-sm text-gray-500"
            dateTime={post.created_at}
          >
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
      </article>
    </Link>
  )
}