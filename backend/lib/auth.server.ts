import { createClient } from '@supabase/supabase-js'

export const AUTH_ACCESS_TOKEN_COOKIE = 'auth-access-token'
export const AUTH_REFRESH_TOKEN_COOKIE = 'auth-refresh-token'

export const authCookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production'
}

const getSupabaseEnv = () => {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Faltan las variables de entorno de Supabase.')
  }

  return { url, serviceRoleKey }
}

export const createSupabaseServerAuthClient = () => {
  const { url, serviceRoleKey } = getSupabaseEnv()
  return createClient(url, serviceRoleKey)
}

export const verifyAccessToken = async (accessToken: string): Promise<boolean> => {
  const supabase = createSupabaseServerAuthClient()

  const { data, error } = await supabase.auth.getUser(accessToken)
  return Boolean(data.user && !error)
}
