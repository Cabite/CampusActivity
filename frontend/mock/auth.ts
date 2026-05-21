import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { role?: string; account?: string; password?: string } }) => {
      const account = body.account || ''
      const password = body.password || ''
      if (account === '2024000001' && password === 'password123') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: 'mock-token-student',
            user_id: 1,
            role: 'user',
            expires_in: 7200,
          },
        }
      }
      return { code: 400, message: '账号或密码错误', data: null }
    },
  },
  {
    url: '/api/auth/register/user',
    method: 'post',
    response: () => ({
      code: 200,
      message: '注册成功',
      data: { user_id: 2, role: 'user', status: 'active' },
    }),
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => ({ code: 200, message: '退出成功', data: null }),
  },
] as MockMethod[]
