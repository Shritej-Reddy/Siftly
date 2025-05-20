"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/ContentCard";
import { mockFeed } from "@/data/mockFeed";
import { getUserInteractions } from "@/lib/db";
import { useUser } from "@/context/UserContext";

interface Interaction {
  post_id: string;
  liked: boolean | null;
  bookmarked: boolean | null;
}

export default function FeedPage() {
  const user = useUser();
  const [interactions, setInteractions] = useState<Record<string, Interaction>>(
    {}
  );

  useEffect(() => {
    const loadInteractions = async () => {
      if (!user?.id) return;
      const { data } = await getUserInteractions(user.id);
      const lookup = Object.fromEntries(
        data?.map((item) => [item.post_id, item]) ?? []
      );
      setInteractions(lookup);
    };

    loadInteractions();
  }, [user?.id]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Curated Feed</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFeed.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            initialLiked={interactions[item.id]?.liked ?? false}
            initialBookmarked={interactions[item.id]?.bookmarked ?? false}
          />
        ))}
      </div>
    </main>
  );
}
