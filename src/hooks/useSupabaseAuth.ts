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
    }).catch(() => {
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, !!session)
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setSession(session)
        setIsLoading(false)
        if (session) {
          await useResumeStore.getState().fetchRemoteResumes()
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setIsLoading(false)
      } else {
        // Handle INITIAL_SESSION or other events
        setSession(session)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, setIsLoading])
}
