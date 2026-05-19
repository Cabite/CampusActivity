import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      const { username, password } = body

      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'vite-mock-token',
            role: 'admin'
          }
        }
      }

      return {
        code: 401,
        message: 'wrong password',
        data: null
      }
    }
  },
  {
    url: '/api/auth/register',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 401,
        message: 'rejected',
        data: null
      }
    }
  }
] as MockMethod[]