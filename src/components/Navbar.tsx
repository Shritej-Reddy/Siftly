"use client";

import { useSearch } from "@/context/SearchContext";
import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Navbar() {
  const { setQuery } = useSearch();

  return (
    <nav className="w-full sticky top-0 z-50 bg-background border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Siftly
        </Link>
        <Link
          href="/notes"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          Notes
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="text-sm px-3 py-1 rounded border bg-background"
          onChange={(e) => setQuery(e.target.value)}
        />
        <AuthButton />
      </div>
    </nav>
  );
}
