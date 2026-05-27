import type { MockMethod } from 'vite-plugin-mock'

const checkinList = [
  {
    activity_id: 1,
    activity_name: '体育锻炼',
    activity_start_time: '2027-01-01 12:00:00',
    checkin_time: '2027-01-01 11:58:00',
    checkin_method: 'code',
  },
  {
    activity_id: 4,
    activity_name: '就业指导',
    activity_start_time: '2026-01-01 20:00:00',
    checkin_time: '2026-01-01 19:55:00',
    checkin_method: 'code',
  },
]

export default [
  {
    url: '/user/checkins',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = [...checkinList]
      if (query.name) {
        list = list.filter((r) => r.activity_name.includes(query.name))
      }
      if (query.activity_id) {
        list = list.filter((r) => String(r.activity_id) === String(query.activity_id))
      }
      if (query.start_date) {
        list = list.filter((r) => r.activity_start_time.startsWith(query.start_date))
      }
      const page = Number(query.page) || 1
      const pageSize = Number(query.page_size) || 10
      const start = (page - 1) * pageSize
      const pageList = list.slice(start, start + pageSize)
      return {
        code: 200,
        message: 'success',
        data: { total: list.length, list: pageList },
      }
    },
  },
] as MockMethod[]
