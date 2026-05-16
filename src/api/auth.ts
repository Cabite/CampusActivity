import axios from 'axios'

import type { LoginRequest, LoginResponse } from '@/types/auth'

export function login(data: LoginRequest) {
    return axios.post<{
        code: number
        message: string
        data: LoginResponse
    }>('/api/auth/login', data)
}