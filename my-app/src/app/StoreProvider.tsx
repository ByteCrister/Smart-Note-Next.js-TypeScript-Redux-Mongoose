'use client';

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
// import { fetchNotes } from '@/lib/features/notes/noteSlice'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    // storeRef.current.dispatch(fetchNotes());
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}