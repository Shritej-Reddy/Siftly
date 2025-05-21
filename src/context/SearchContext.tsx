'use client'

import { createContext, useContext, useState } from 'react'

const SearchContext = createContext<{
  query: string
  setQuery: (val: string) => void
}>({
  query: '',
  setQuery: () => {},
})

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState('')
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)
