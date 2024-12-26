'use client'
import Image from "next/image";
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './avatar'
import { redirect } from "next/navigation";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [age, setAge] = useState<string | null>(null)
  const [character, setCharacter] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url, age, character, address`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setAge(data.age)
        setCharacter(data.character)
        setAddress(data.address)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
    age, 
    character, 
    address,
    fullname
  }: {
    username: string | null
    website: string | null
    avatar_url: string | null
    age: string | null
    character: string | null
    address: string | null
    fullname: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        age,
        character,
        address,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!');
      redirect("/");
    } catch (error) {
      console.error('Error updating the data:', error)
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Image 
        src="/assets/register-headbar.jpg"
        alt="register"
        width={1754}
        height={266}
      />
      <div className="form-widget max-w -4xl mx-[10%] p-8 bg-bl ack text-white border border-white uppercase">
        <div className="flex justify-center mb-8">
          <Avatar
            uid={user?.id ?? null}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateProfile({ fullname, username, website, avatar_url: url, age, character, address })
            }}
          />
        </div>


        <div className="space-y-6">
          <h2 className="text-center text-red-400 ">Email Contact</h2>

          <div className="flex items-center">
            <label htmlFor="email" className="w-1/4 text-sm font-medium">Email</label>
            <input
              id="email"
              type="text"
              value={user?.email ?? 'Loading...'}
              disabled
              className="w-3/4 px-3 py-2 bg-black border border-white rounded-md text-white"
            />
          </div>


          <div className="flex items-center">
            <label htmlFor="username" className="w-1/4 text-sm font-medium">Username</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              className="w-3/4 px-3 py-2 bg-black border border-white rounded-md text-white"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="website" className="w-1/4 text-sm font-medium">Website</label>
            <input
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-3/4 px-3 py-2 bg-black border border-white rounded-md text-white"
            />
          </div>

          <h2 className="text-center text-red-400 ">Main Account Info</h2>

          <div className="flex items-center">
            <label htmlFor="fullName" className="w-1/4 text-sm font-medium">Spiritual Name</label>
            <input
              id="fullName"
              type="text"
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
              className="w-3/4 px-3 py-2 bg-black border border-white rounded-md text-white"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="age" className="w-1/4 text-sm font-medium">Spiritual Age</label>
            <input
              id="age"
              type="number"
              value={age || ''}
              onChange={(e) => setAge(e.target.value)}
              className="w-3/4 px-3 py-2 bg-black border border-white rounded-md text-white"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="character" className="w-1/4 text-sm font-medium">Character</label>
            <select
              id="character"
              value={character || ''}
              onChange={(e) => setCharacter(e.target.value)}
              className="w-3/4 px-3 py-2 bg-black border border-white rounded-md text-white"
            >
              <option value="">Select a character</option>
              <option value="elf">Elf</option>
              <option value="vampire">Vampire</option>
              <option value="werewolf">Werewolf</option>
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="address" className="w-1/4 text-sm font-medium">Location</label>
            <input
              id="address"
              type="text"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
              className="w-3/4 px-3 py-2 bg-black border border-white rounded-md text-white"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              onClick={() => updateProfile({ fullname, username, website, avatar_url, age, character, address })}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </button>

            <form action="/auth/signout" method="post">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
