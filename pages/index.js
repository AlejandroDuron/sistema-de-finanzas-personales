import { useEffect } from 'react'
import { useRouter } from 'next/router'

function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light font-display text-sm font-medium text-slate-600">
      Redirigiendo al inicio de sesión...
    </div>
  )
}

export default Home
