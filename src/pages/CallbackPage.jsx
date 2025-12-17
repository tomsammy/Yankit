import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const finishOAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        navigate('/signin')
        return
      }

      if (data.session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/signin')
      }
    }

    finishOAuth()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  )
}
