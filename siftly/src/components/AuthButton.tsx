'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/superbase'
import { Session, User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span className="text-sm">Hello, {user.email}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  )
}
