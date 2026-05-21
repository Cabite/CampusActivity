import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/user/profile',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: {
        user_id: 1,
        student_id: '2024000001',
        email: 'user@example.com',
        username: '张三',
        avatar: '',
        gender: '男',
        college: '计算机学院',
        major: '计算机科学与技术',
        grade: '2024级',
        phone: '13800138000',
        status: 'active',
        achievement: { title: '初级探索者', effective_participation_count: 5 },
      },
    }),
  },
  {
    url: '/api/user/profile',
    method: 'put',
    response: () => ({ code: 200, message: '更新成功', data: null }),
  },
] as MockMethod[]
