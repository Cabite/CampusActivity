import { apiPost } from './request'

export function checkin(activity_id: number, checkin_code: string) {
  return apiPost<{ checkin_id: number; checkin_time: string }>('/checkin', {
    activity_id,
    checkin_code,
  })
}
