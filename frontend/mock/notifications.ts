import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/notifications',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: {
        total: 2,
        unread_count: 1,
        list: [
          {
            notification_id: 1,
            title: '「体育锻炼」将在一小时后开始',
            content: '您已报名的活动即将开始，请准时参加。',
            type: 'activity_reminder',
            related_id: 1,
            is_read: false,
            created_at: '2027-01-01 11:00:00',
          },
          {
            notification_id: 2,
            title: '报名结果通知',
            content: '您已成功报名「体育锻炼」。',
            type: 'registration_result',
            is_read: true,
            created_at: '2026-12-01 09:00:00',
          },
        ],
      },
    }),
  },
  {
    url: /\/notifications\/\d+\/read$/,
    method: 'put',
    response: () => ({ code: 200, message: '已标记为已读', data: null }),
  },
  {
    url: '/announcements',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          announcement_id: 1,
          title: '系统维护通知',
          content: '系统将于今晚22:00进行维护，请提前保存数据。',
          start_time: '2026-05-01 09:00:00',
          end_time: '2026-05-30 23:59:59',
        },
      ],
    }),
  },
] as MockMethod[]
