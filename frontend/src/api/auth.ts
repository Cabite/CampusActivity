import { apiPost } from './request'
import type { LoginData, RegisterData } from '@/types/api'

export interface RegisterPayload {
  student_id: string
  email: string
  username: string
  password: string
  confirm_password: string
  gender: string
  college: string
  major: string
  grade: string
  phone?: string
}

export function login(account: string, password: string) {
  return apiPost<LoginData>('/auth/login', {
    role: 'user',
    account,
    password,
  })
}

export function register(payload: RegisterPayload) {
  return apiPost<RegisterData>('/auth/register/user', payload)
}

export function logout() {
  return apiPost<null>('/auth/logout')
}

/** 修改密码（文档 1.7） */
export function changePassword(old_password: string, new_password: string, confirm_password: string) {
  return apiPost<null>('/user/reset-password', {
    old_password,
    new_password,
    confirm_password,
  })
}
