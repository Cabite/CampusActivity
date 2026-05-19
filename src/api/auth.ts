import axios from 'axios'

import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth'

export function login(data: LoginRequest) {
    return axios.post<{
        code: number
        message: string
        data: LoginResponse
    }>('/api/auth/login', data)
}

export function register(data: RegisterRequest) {
    return axios.post<{
        code: number
        message: string
        data: RegisterResponse
    }>('/api/auth/register', data)
}