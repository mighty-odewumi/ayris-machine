'use client';

import Image from "next/image";
import { useFetchUsers } from '@/hooks/useFetchUsers';

export default function UserList() {
  const { profiles, totalCount, loading, error, refetch } = useFetchUsers()

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">Error loading users</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Total: <span className="font-semibold text-black">{totalCount}</span> users
          </span>
          <button 
            onClick={refetch}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map(profile => (
            <div key={profile.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <Image 
                      src={profile.avatar_url} 
                      alt={profile.username || 'User'} 
                      className="w-full h-full object-cover" 
                      width={64}
                      height={64}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {(profile?.username || profile?.email)?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-2">
                  <h2 className="font-bold text-lg text-gray-900">
                    {profile?.username || 'Unknown User'}
                  </h2>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center justify-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <span>{profile?.email || 'No email'}</span>
                    </p>
                    
                    {profile?.age && (
                      <p className="flex items-center justify-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Age: {profile.age}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
