"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/ContentCard";
import { mockFeed } from "@/data/mockFeed";
import { getUserInteractions, getUserNotes } from "@/lib/db";
import { useUser } from "@/context/UserContext";
import { useSearch } from "@/context/SearchContext";

interface Interaction {
  post_id: string;
  liked: boolean | null;
  bookmarked: boolean | null;
  note?: string | null;
}

export default function FeedPage() {
  const user = useUser();
  const [interactions, setInteractions] = useState<Record<string, Interaction>>(
    {}
  );

  const { query } = useSearch();

  const filteredFeed = mockFeed.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      const { data: interactions } = await getUserInteractions(user.id);
      const { data: notes } = await getUserNotes(user.id);

      const interactionMap: Record<string, Interaction> = {};

      interactions?.forEach((item) => {
        interactionMap[item.post_id] = {
          post_id: item.post_id,
          liked: item.liked,
          bookmarked: item.bookmarked,
          note: "",
        };
      });

      notes?.forEach((note) => {
        if (!interactionMap[note.post_id]) {
          interactionMap[note.post_id] = {
            post_id: note.post_id,
            liked: null,
            bookmarked: null,
            note: note.note,
          };
        } else {
          interactionMap[note.post_id].note = note.note;
        }
      });

      setInteractions(interactionMap);
    };

    loadUserData();
  }, [user?.id]);
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Curated Feed</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeed.length === 0 ? (
          <p className="text-muted-foreground text-sm mt-4">
            No matching results.
          </p>
        ) : (
          filteredFeed.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              initialLiked={interactions[item.id]?.liked ?? false}
              initialBookmarked={interactions[item.id]?.bookmarked ?? false}
              initialNote={interactions[item.id]?.note ?? ""}
            />
          ))
        )}
      </div>
    </main>
  );
}
