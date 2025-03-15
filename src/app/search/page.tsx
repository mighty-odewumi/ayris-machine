'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Combobox } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { categoryGroups, type CategoryGroup, type Category } from '@/constants/categories1'

// Previous interfaces remain the same...
interface DatabaseCategory {
  id: any;
  name: any;
  group_name: any;
}

interface DatabasePostCategory {
  category: DatabaseCategory[];
}

interface DatabasePost {
  id: any;
  title: any;
  content: any;
  image_url: any;
  created_at: any;
  categories: DatabasePostCategory[];
}

interface PostCategory {
  category: {
    id: string;
    name: string;
    group_name: string;
  }
}

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  categories: PostCategory[];
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const allCategories = categoryGroups.flatMap(group => 
    group.categories.map(category => ({
      ...category,
      group: group.title
    }))
  )

  const filteredCategories = query === ''
    ? allCategories
    : allCategories.filter((category) =>
        category.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            image_url,
            created_at,
            categories:posts_categories (
              category:categories (
                id,
                name,
                group_name
              )
            )
          `)
          .order('created_at', { ascending: false })
    
        if (error) throw error

        const dbPosts = (data as unknown) as DatabasePost[]
    
        const typedPosts: Post[] = dbPosts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          image_url: post.image_url,
          created_at: post.created_at,
          categories: post.categories.map(categoryWrapper => ({
            category: {
              id: categoryWrapper.category[0].id,
              name: categoryWrapper.category[0].name,
              group_name: categoryWrapper.category[0].group_name
            }
          }))
        }))
    
        // Filter posts by both search query and categories
        const filteredPosts = typedPosts.filter(post => {
          const matchesSearch = searchQuery
            ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            : true

          const matchesCategories = selectedCategories.length === 0 || 
            selectedCategories.every(selectedId =>
              post.categories.some(pc => pc.category.id === selectedId)
            )

          return matchesSearch && matchesCategories
        })
    
        setPosts(filteredPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(() => fetchPosts(), 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, selectedCategories, supabase])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Discover Posts</h1>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="relative">
            <Combobox value={selectedCategories} onChange={setSelectedCategories} multiple>
              <div className="relative">
                <Combobox.Button className="w-full p-3 border rounded-lg text-left flex items-center justify-between bg-white">
                  <span className="truncate">
                    {selectedCategories.length === 0
                      ? 'Filter by categories...'
                      : `${selectedCategories.length} categories selected`}
                  </span>
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </Combobox.Button>

                <Combobox.Input
                  className="hidden"
                  displayValue={() => ''}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <Combobox.Options className="absolute z-20 mt-1 w-full max-h-96 overflow-y-auto rounded-md bg-white shadow-lg border p-2">
                  <input
                    type="text"
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Search categories..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  
                  {categoryGroups.map((group) => {
                    const groupCategories = filteredCategories.filter(
                      cat => cat.group === group.title
                    )
                    
                    if (groupCategories.length === 0) return null
                    
                    return (
                      <div key={group.title} className="mb-4">
                        <h4 className="font-medium p-2 bg-gray-50 rounded">
                          {group.title}
                        </h4>
                        <div className="mt-1">
                          {groupCategories.map((category) => (
                            <Combobox.Option
                              key={category.id}
                              value={category.id}
                              className={({ active, selected }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-blue-50' : ''
                                } ${
                                  selected ? 'bg-blue-100' : ''
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                    {category.name}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                      <CheckIcon className="h-5 w-5" />
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Searching posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts found matching your criteria
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white"
            >
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
                  {post.categories.map(({ category }) => (
                    <span 
                      key={category.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {category.name}
                    </span>
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
          ))}
        </div>
      )}
    </div>
  )
}