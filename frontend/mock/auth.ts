import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/auth/login',
    method: 'post',
    response: ({ body }: { body: { account?: string; password?: string } }) => {
      if (body.account === '2024000001' && body.password === 'password123') {
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
    url: '/auth/register/user',
    method: 'post',
    response: () => ({
      code: 200,
      message: '注册成功，已自动登录',
      data: { userId: 1001, token: 'mock-token-student-new' },
    }),
  },
  {
    url: '/auth/logout',
    method: 'post',
    response: () => ({ code: 200, message: '退出成功', data: null }),
  },
  {
    url: '/user/reset-password',
    method: 'post',
    response: () => ({ code: 200, message: '密码重置成功', data: null }),
  },
] as MockMethod[]
