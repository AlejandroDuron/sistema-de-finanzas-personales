import { createClient } from '@supabase/supabase-js'

export const AUTH_ACCESS_TOKEN_COOKIE = 'auth-access-token'
export const AUTH_REFRESH_TOKEN_COOKIE = 'auth-refresh-token'

export const authCookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production'
}

const normalizeEnvValue = (value?: string): string => {
  if (!value) {
    return ''
  }

  const trimmed = value.trim()
  return trimmed.replace(/^['\"]|['\"]$/g, '')
}

const getSupabaseEnv = () => {
  const url = normalizeEnvValue(process.env.SUPABASE_URL)
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const serverAnonKey = normalizeEnvValue(process.env.SUPABASE_ANON_KEY)
  const publicAnonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const authKey = serviceRoleKey || serverAnonKey || publicAnonKey

  if (!url || !authKey) {
    throw new Error('Faltan las variables de entorno de Supabase.')
  }

  return { url, authKey }
}

export const createSupabaseServerAuthClient = () => {
  const { url, authKey } = getSupabaseEnv()
  return createClient(url, authKey)
}

export const verifyAccessToken = async (accessToken: string): Promise<boolean> => {
  const supabase = createSupabaseServerAuthClient()

  const { data, error } = await supabase.auth.getUser(accessToken)
  return Boolean(data.user && !error)
}
