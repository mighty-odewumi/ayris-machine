'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { categoryGroups } from '@/constants/categories1'
import Link from 'next/link'
interface PostCategory {
  category: {
    id: string;
    name: string;
    group_name: string | null;
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('AND')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  // Process categories
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Fetch and filter posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        // First, get all posts with their direct categories (for legacy posts)
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            image_url,
            created_at,
            category,
            category_group
          `)
          .order('created_at', { ascending: false })
        
        if (postsError) throw postsError
        
        // Then get all categories for posts using the posts_categories table (for new posts)
        const postIds = postsData.map(post => post.id)
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('posts_categories')
          .select(`
            post_id,
            category_id,
            category_name,
            category_group
          `)
          .in('post_id', postIds)
        
        if (categoriesError) throw categoriesError
        
        // Now combine the data manually, handling both legacy and new category formats
        const typedPosts: Post[] = postsData.map(post => {
          // Find all categories for this post from posts_categories table
          const relationCategories = categoriesData
            .filter(cat => cat.post_id === post.id)
            .map(cat => {
              // Make sure category_name isn't actually an ID
              const displayName = cat.category_name && !cat.category_name.startsWith('legacy-') 
                ? cat.category_name 
                : cat.category_id.replace(/^legacy-/, '').replace(/-/g, ' ');
                
              return {
                category: {
                  id: cat.category_id,
                  name: displayName,
                  group_name: cat.category_group
                }
              };
            });
          // Check if this is a legacy post with direct category
          const hasLegacyCategory = post.category && post.category.trim() !== ''
          
          let allCategories = [...relationCategories]
          
          // If it's a legacy post with a direct category, add that too
          if (hasLegacyCategory) {
            // For legacy posts, create a synthetic ID based on the category name
            // This ensures we can filter on it consistently
            const legacyCategoryId = `legacy-${post.category.toLowerCase().replace(/\s+/g, '-')}`
            
            allCategories.push({
              category: {
                id: legacyCategoryId,
                name: post.category,
                group_name: post.category_group
              }
            })
          }
          
          return {
            id: post.id,
            title: post.title,
            content: post.content,
            image_url: post.image_url || undefined,
            created_at: post.created_at,
            categories: allCategories,
            // We could add a flag here to identify legacy posts if needed
            isLegacy: hasLegacyCategory && relationCategories.length === 0
          }
        })
        
        // Filter posts by both search query and categories
        const filteredPosts = typedPosts.filter(post => {
          // Check if post matches search query
          const matchesSearch = searchQuery
            ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            : true

          // Check if post matches categories based on filter mode
          let matchesCategories = true;
          if (selectedCategories.length > 0) {
            // For legacy posts, we need to check if any selected category matches the post.category
            // This is a special case for backward compatibility
            // const legacySelectedCategoryIds = selectedCategories.filter(id => id.startsWith('legacy-'))
            // const relationSelectedCategoryIds = selectedCategories.filter(id => !id.startsWith('legacy-'))
            
            if (filterMode === 'AND') {
              // AND condition: post must have ALL selected categories
              matchesCategories = selectedCategories.every(selectedId =>
                post.categories.some(pc => pc.category.id === selectedId)
              );
            } else {
              // OR condition: post must have ANY selected category
              matchesCategories = selectedCategories.some(selectedId =>
                post.categories.some(pc => pc.category.id === selectedId)
              );
            }
          }

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
  }, [searchQuery, selectedCategories, filterMode, supabase])
  // Handler for toggling the dropdown
  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDropdownOpen(prev => !prev)
  }

  // Selected category names for display
  const selectedCategoryNames = selectedCategories.map(id => 
    allCategories.find(cat => cat.id === id)?.name
  ).filter(Boolean)

  function isUUID(str: string): boolean {
    // Simple UUID check - could be more precise but this captures most UUIDs
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(str);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Discover Posts</h1>
        
        <div className="space-y-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Categories dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={handleDropdownToggle}
              className="w-full p-3 border rounded-lg text-left flex items-center justify-between bg-white"
            >
              <span className="truncate">
                {selectedCategories.length === 0
                  ? 'Filter by categories...'
                  : `${selectedCategories.length} categories selected: ${selectedCategoryNames.join(', ')}`}
              </span>
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full max-h-96 overflow-y-auto rounded-md bg-white shadow-lg border p-2">
                {/* Category search input */}
                <input
                  type="text"
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="Search categories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Category list */}
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
                        {groupCategories.map((category) => {
                          const isSelected = selectedCategories.includes(category.id)
                          return (
                            <div 
                              key={category.id}
                              className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                isSelected ? 'bg-blue-100' : 'hover:bg-blue-50'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCategories(prev => 
                                  isSelected 
                                    ? prev.filter(id => id !== category.id) 
                                    : [...prev, category.id]
                                )
                              }}
                            >
                              <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                                {category.name}
                              </span>
                              {isSelected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <CheckIcon className="h-5 w-5" />
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                
                {/* Selected categories display and actions */}
                {selectedCategories.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {selectedCategories.length} categories selected
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCategories([])
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Selected category pills */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 py-2">
              {selectedCategories.map(id => {
                const category = allCategories.find(c => c.id === id)
                if (!category) return null
                
                return (
                  <span 
                    key={id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                  >
                    {category.name}
                    <button 
                      onClick={() => setSelectedCategories(prev => prev.filter(c => c !== id))}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      &times;
                    </button>
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category filter mode toggle (only when multiple categories selected) */}
      {selectedCategories.length > 1 && (
        <div className="flex items-center justify-start py-2">
          <span className="text-sm font-medium mr-2">Filter mode:</span>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setFilterMode('AND')}
              className={`px-3 py-1.5 text-sm ${
                filterMode === 'AND' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Match ALL (AND)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('OR')}
              className={`px-3 py-1.5 text-sm ${
                filterMode === 'OR' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Match ANY (OR)
            </button>
          </div>
        </div>
      )}

      {/* Search results */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Searching posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts found matching your criteria
        </div>
      ) : (
        
        // Then replace your posts map section with this:
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/post/${post.id}`} 
              className="block"
            >
              <article 
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white h-full"
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
                    {/* Use a Map to deduplicate categories by name */}
                    {Array.from(
                      new Map(
                        post.categories.map(({ category }) => [category.name, category])
                      ).values()
                    ).map((category) => {
                    const displayName = category.name.startsWith('legacy-') 
                      ? category.name.substring(7).replace(/-/g, ' ') 
                      : !isUUID(category.name) && category.name;

                    return (
                      <span 
                        key={category.id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {displayName}
                      </span>
                      )
                    })}
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
          ))}
        </div>
      )}
    </div>
  )
}