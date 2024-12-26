/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from "next/image";

interface Profile {
  id: string
  email: string
  username: string
  age: number
  avatar_url: string
}

export default function UserList() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true)
        
        // Fetch profiles
        const { data, error, count } = await supabase
          .from('profiles')
          .select('id, username, age, email, avatar_url', { count: 'exact' });
        
        if (error) throw error;

        setProfiles(data || [])
        setTotalCount(count || 0)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List (Total: {totalCount})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map(profile => (
          <div key={profile.id} className="border rounded-lg p-4 shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.username || 'User'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-xl font-bold">{(profile?.username || profile?.email)?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <h2 className="font-bold">{profile?.username || 'N/A'}</h2>
                <p className="text-sm text-gray-600">Email: {profile?.email}</p>
                <p className="text-sm text-gray-600">Age: {profile?.age || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
