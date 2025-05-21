"use client";

import React, { useEffect } from "react";
import { CalendarIcon, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { Bookmark, BookmarkCheck, Heart, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { upsertInteraction, upsertNote } from "@/lib/db";
import { useUser } from "@/context/UserContext";

interface ContentItem {
  id: string;
  source: string;
  title: string;
  author: string;
  url: string;
  preview: string;
  publishedAt: string;
}

export default function ContentCard({
  item,
  initialLiked,
  initialBookmarked,
  initialNote,
}: {
  item: ContentItem;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  initialNote?: string;
}) {
  const [liked, setLiked] = useState<boolean>(initialLiked ?? false);
  const [bookmarked, setBookmarked] = useState<boolean>(
    initialBookmarked ?? false
  );
  const [note, setNote] = useState(initialNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setLiked(initialLiked ?? false);
  }, [initialLiked]);

  useEffect(() => {
    setBookmarked(initialBookmarked ?? false);
  }, [initialBookmarked]);

  useEffect(() => {
    setNote(initialNote ?? "");
  }, [initialNote]);

  const user = useUser();

  const handleLike = async () => {
    if (!user) return;
    const newLiked = !liked;
    setLiked(newLiked);
    await upsertInteraction(user.id, item.id, newLiked, bookmarked);
  };

  const handleBookmark = async () => {
    if (!user) return;
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    await upsertInteraction(user.id, item.id, liked, newBookmarked);
  };

  const handleNoteSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await upsertNote(user.id, item.id, note);
    setSaving(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{item.title}</CardTitle>
          <Link href={item.url} target="_blank">
            <ExternalLink size={18} />
          </Link>
        </div>
        <div className="text-xs text-muted-foreground">
          by {item.author} • {item.source}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{item.preview}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-muted-foreground text-xs">
            <CalendarIcon size={14} />
            {format(new Date(item.publishedAt), "PPP")}
          </div>
          <div className="flex gap-3">
            <button onClick={handleLike}>
              {liked ? <HeartHandshake size={16} /> : <Heart size={16} />}
            </button>
            <button onClick={handleBookmark}>
              {bookmarked ? (
                <BookmarkCheck size={16} />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
            <div className="mt-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleNoteSave}
                rows={3}
                placeholder="Write your note here..."
                className="w-full text-sm p-2 border rounded-md resize-none bg-background text-foreground"
              />
              {note.length > 0 && (
                <button
                  onClick={() => {
                    const cleared = "";
                    setNote(cleared);
                    upsertNote(user!.id, item.id, cleared);
                  }}
                  className="text-xs mt-1 underline text-red-500"
                >
                  Clear Note
                </button>
              )}

              {saving ? (
                <p className="text-xs text-muted-foreground mt-1">Saving...</p>
              ) : saveSuccess ? (
                <p className="text-xs text-green-500 mt-1">✓ Note saved</p>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
