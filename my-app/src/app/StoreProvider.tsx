'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { fetchNotes } from '@/lib/features/notes/noteSlice';
import validateToken from '@/services/helper/REST-API/validateToken';
import { useRouter } from 'next/navigation';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const isTokenValid = await validateToken(); //* return the token
        if (isTokenValid) {
          storeRef.current?.dispatch(fetchNotes(isTokenValid)); // * Sending the token as parameter
        } else {
          router.push("/user-auth");
        }
      } catch (error) {
        console.error("Error during token validation", error);
        router.push("/user-auth");
      }
    };

    initialize();
  }, [router]);


  return <Provider store={storeRef.current}>{children}</Provider>;
}