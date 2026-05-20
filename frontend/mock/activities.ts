import type { MockMethod } from 'vite-plugin-mock'

const activities = [
  {
    activity_id: 1,
    name: '体育锻炼',
    start_time: '2027-01-01 12:00:00',
    end_time: '2027-01-01 13:00:00',
    category_name: '文体类',
    category_path: '文体类 > 体育竞赛',
    location: '北操场',
    campus: '良乡',
    current_participants: 10,
    max_participants: 30,
    status: 'open',
  },
  {
    activity_id: 2,
    name: '读书会',
    start_time: '2027-01-01 10:00:00',
    end_time: '2027-01-01 10:20:00',
    category_name: '学术类',
    category_path: '学术类 > 沙龙',
    location: '图书馆',
    campus: '良乡',
    current_participants: 1,
    max_participants: 5,
    status: 'open',
  },
  {
    activity_id: 3,
    name: '校园迎新',
    start_time: '2027-01-01 09:00:00',
    end_time: '2027-01-01 10:20:00',
    category_name: '社交类',
    category_path: '社交类 > 迎新会',
    location: '东门',
    campus: '良乡',
    current_participants: 2,
    max_participants: 10,
    status: 'ongoing',
  },
]

export default [
  {
    url: '/api/activities',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = [...activities]
      if (query.status) {
        const statuses = query.status.split(',')
        list = list.filter((a) => statuses.includes(a.status))
      }
      if (query.keyword) {
        list = list.filter((a) => a.name.includes(query.keyword))
      }
      return {
        code: 200,
        message: 'success',
        data: { total: list.length, page: 1, page_size: 20, list },
      }
    },
  },
  {
    url: /\/api\/activities\/\d+$/,
    method: 'get',
    response: ({ url }: { url: string }) => {
      const id = Number(url.split('/').pop())
      const item = activities.find((a) => a.activity_id === id) || activities[0]
      return {
        code: 200,
        message: 'success',
        data: {
          ...item,
          organizer_id: 1,
          organizer_name: '体育部',
          category_id: 201,
          registration_deadline: '2027-01-01 09:00:00',
          cancel_deadline: '2027-01-01 07:00:00',
          description:
            '本次活动旨在促进校园体育文化建设，欢迎同学们积极参与。活动包含热身、主项训练与放松环节。',
          is_registered: false,
          registration_status: null,
          created_at: '2026-05-01 10:00:00',
          updated_at: '2026-05-01 10:00:00',
        },
      }
    },
  },
  {
    url: '/api/categories',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          id: 1,
          name: '学术类',
          level: 1,
          sort_order: 1,
          children: [{ id: 101, name: '讲座', level: 2, sort_order: 1 }],
        },
        {
          id: 2,
          name: '文体类',
          level: 1,
          sort_order: 2,
          children: [{ id: 201, name: '体育竞赛', level: 2, sort_order: 1 }],
        },
      ],
    }),
  },
] as MockMethod[]
