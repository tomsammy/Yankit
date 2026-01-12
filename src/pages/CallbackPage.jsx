import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function CallbackPage() {
  const navigate = useNavigate()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return

    const timeoutId = setTimeout(() => {
      if (!handledRef.current) {
        navigate('/signin', { replace: true })
      }
    }, 10000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (handledRef.current) return

        if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && session)) {
          handledRef.current = true
          clearTimeout(timeoutId)
          navigate('/dashboard', { replace: true })
        } else if (event === 'SIGNED_OUT') {
          handledRef.current = true
          clearTimeout(timeoutId)
          navigate('/signin', { replace: true })
        }
      }
    )

    const checkSession = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))

        const { data, error } = await supabase.auth.getSession()

        if (handledRef.current) return

        if (error) {
          handledRef.current = true
          clearTimeout(timeoutId)
          navigate('/signin', { replace: true })
          return
        }

        if (data.session) {
          handledRef.current = true
          clearTimeout(timeoutId)
          navigate('/dashboard', { replace: true })
        }
      } catch (err) {
        if (!handledRef.current) {
          handledRef.current = true
          clearTimeout(timeoutId)
          navigate('/signin', { replace: true })
        }
      }
    }

    checkSession()

    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  )
}
