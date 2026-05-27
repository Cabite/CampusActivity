import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/leaderboard',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: {
        total: 3,
        list: [
          {
            rank: 1,
            user_id: 1,
            student_id: '2024000001',
            college: '计算机学院',
            grade: '2024级',
            registration_count: 20,
            effective_participation_count: 15,
          },
          {
            rank: 2,
            user_id: 2,
            student_id: '2024000002',
            college: '信息与电子学院',
            grade: '2023级',
            registration_count: 18,
            effective_participation_count: 12,
          },
          {
            rank: 3,
            user_id: 3,
            student_id: '2023000001',
            college: '计算机学院',
            grade: '2023级',
            registration_count: 15,
            effective_participation_count: 10,
          },
        ],
      },
    }),
  },
] as MockMethod[]
