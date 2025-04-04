import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Post } from '@/types/post'
// import { isUUID } from '@/utils/categoryUtils'

export function usePosts(
  searchQuery: string,
  selectedCategories: string[],
  filterMode: 'AND' | 'OR'
) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

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
          
          const allCategories = [...relationCategories]
          
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

  return { posts, loading }
}