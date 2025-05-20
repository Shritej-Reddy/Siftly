"use client";

import React, { useEffect } from "react";
import { CalendarIcon, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { Bookmark, BookmarkCheck, Heart, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { upsertInteraction } from "@/lib/db";
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

export default function ContentCard({ item, initialLiked, initialBookmarked }: { item: ContentItem, initialLiked?: boolean, initialBookmarked?: boolean }) {
  const [liked, setLiked] = useState<boolean>(initialLiked ?? false)
const [bookmarked, setBookmarked] = useState<boolean>(initialBookmarked ?? false)

useEffect(() => {
  setLiked(initialLiked ?? false)
}, [initialLiked])

useEffect(() => {
  setBookmarked(initialBookmarked ?? false)
}, [initialBookmarked])


  const user = useUser();

  const handleLike = async () => {
  if (!user) return
  const newLiked = !liked
  setLiked(newLiked)
  await upsertInteraction(user.id, item.id, newLiked, bookmarked)
}

const handleBookmark = async () => {
  if (!user) return
  const newBookmarked = !bookmarked
  setBookmarked(newBookmarked)
  await upsertInteraction(user.id, item.id, liked, newBookmarked)
}

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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
