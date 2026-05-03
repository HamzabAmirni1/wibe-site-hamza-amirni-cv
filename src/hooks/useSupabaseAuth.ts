import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useResumeStore } from '@/store/useResumeStore'


export function useSupabaseAuth() {
  const { setSession, setIsLoading } = useAuthStore()

  useEffect(() => {
    // Get initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setSession(session)
          await useResumeStore.getState().fetchRemoteResumes()
        } else {
          // Fallback: If no session but hash exists, try to refresh
          if (window.location.hash.includes('access_token')) {
             const { data, error } = await supabase.auth.getSession()
             if (data.session) {
               setSession(data.session)
               await useResumeStore.getState().fetchRemoteResumes()
             }
          }
        }
      } catch (e) {
        console.error("Session check error", e)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

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
        setSession(session)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, setIsLoading])
}
