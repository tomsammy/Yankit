import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

function AuthHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleOAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth error:', error)
        return
      }

      if (data.session) {
        navigate('/dashboard') // or wherever
      }
    }

    handleOAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate('/dashboard')
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [navigate])

  return null
}

export default AuthHandler
