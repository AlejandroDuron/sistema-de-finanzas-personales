'use server'

import { cookies } from 'next/headers'
import {
  getCurrentUserFromCookie,
  loginWithPassword,
  logoutCurrentUser,
  registerWithPassword,
  requestPasswordReset
} from '@/backend/modules/auth/auth.service'
import type { AuthenticatedUser } from '@/backend/types/auth'

export interface AuthUser {
  id: string
  nombre: string
  email: string
}

export interface AuthActionResult {
  success: boolean
  message?: string
  user?: AuthUser
}

const mapBackendUser = (user: AuthenticatedUser): AuthUser => ({
  id: user.id,
  email: user.email,
  nombre: user.nombre
})

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '').trim()

  const result = await loginWithPassword({ email, password }, cookies())
  return result.user ? { ...result, user: mapBackendUser(result.user) } : result
}

export async function requestPasswordResetAction(formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase()

  return requestPasswordReset(email)
}

export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '').trim()
  const confirmPassword = String(formData.get('confirmPassword') || '').trim()

  const result = await registerWithPassword({ name, email, password, confirmPassword })
  return result.user ? { ...result, user: mapBackendUser(result.user) } : result
}

export async function logoutAction(): Promise<void> {
  await logoutCurrentUser(cookies())
}

export async function getCurrentUserAction(): Promise<AuthUser | null> {
  const user = await getCurrentUserFromCookie(cookies())
  return user ? mapBackendUser(user) : null
}

