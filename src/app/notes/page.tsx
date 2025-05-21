'use client'

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { getUserNotes } from '@/lib/db'
import { mockFeed } from '@/data/mockFeed'

interface NoteItem {
  post_id: string
  note: string
}

export default function NotesPage() {
  const user = useUser()
  const [notes, setNotes] = useState<NoteItem[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return
      const { data } = await getUserNotes(user.id)
      if (data) setNotes(data)
    }
    fetchNotes()
  }, [user?.id])

  const getPostInfo = (postId: string) => mockFeed.find(p => p.id === postId)

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Notes</h1>
      {notes.length === 0 ? (
        <p className="text-muted-foreground text-sm">You haven’t written any notes yet.</p>
      ) : (
        <div className="space-y-6">
          {notes.map((noteItem) => {
            const post = getPostInfo(noteItem.post_id)
            return (
              <div key={noteItem.post_id} className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold">
                  {post?.title ?? 'Unknown Post'}
                </h2>
                <p className="text-xs text-muted-foreground mb-2">{post?.source}</p>
                <p className="text-sm whitespace-pre-wrap">{noteItem.note}</p>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
