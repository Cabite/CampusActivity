import type { MockMethod } from 'vite-plugin-mock'

const myList = [
  {
    registration_id: 1,
    activity_id: 1,
    activity_name: '体育锻炼',
    start_time: '2027-01-01 12:00:00',
    end_time: '2027-01-01 13:00:00',
    location: '北操场',
    registration_time: '2026-12-01 09:00:00',
    status: 'registered',
    checkin_status: 'checked',
    checkin_time: '2027-01-01 11:58:00',
  },
  {
    registration_id: 2,
    activity_id: 4,
    activity_name: '就业指导',
    start_time: '2027-01-01 20:00:00',
    end_time: '2027-01-01 22:00:00',
    location: '教学楼',
    registration_time: '2026-12-05 10:00:00',
    status: 'registered',
    checkin_status: 'not_checked',
    checkin_time: null,
  },
]

export default [
  {
    url: '/api/registrations/my',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = [...myList]
      const now = Date.now()

      if (query.type === 'upcoming') {
        list = list.filter((r) => new Date(r.end_time.replace(/-/g, '/')).getTime() > now)
      } else if (query.type === 'past') {
        list = list.filter((r) => new Date(r.end_time.replace(/-/g, '/')).getTime() <= now)
      }

      if (query.keyword) {
        list = list.filter((r) => r.activity_name.includes(query.keyword))
      }
      if (query.activity_id) {
        list = list.filter((r) => String(r.activity_id) === String(query.activity_id))
      }

      return {
        code: 200,
        message: 'success',
        data: {
          total: list.length,
          page: Number(query.page) || 1,
          page_size: Number(query.page_size) || 10,
          list,
        },
      }
    },
  },
] as MockMethod[]
