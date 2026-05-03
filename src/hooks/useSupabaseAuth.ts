import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useResumeStore } from '@/store/useResumeStore'


export function useSupabaseAuth() {
  const { setSession, setIsLoading } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
      if (session) {
        useResumeStore.getState().fetchRemoteResumes()
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
      if (session) {
        useResumeStore.getState().fetchRemoteResumes()
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, setIsLoading])
}
