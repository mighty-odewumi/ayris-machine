import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Profile {
  id: string
  email: string
  username: string
  age: number
  avatar_url: string
}

interface UseFetchUsersReturn {
  profiles: Profile[]
  totalCount: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFetchUsers(): UseFetchUsersReturn {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch profiles with count
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id, username, age, email, avatar_url', { count: 'exact' })
        .order('username', { ascending: true })
      
      if (error) throw error

      setProfiles(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching profiles:', error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  return {
    profiles,
    totalCount,
    loading,
    error,
    refetch: fetchProfiles
  }
}