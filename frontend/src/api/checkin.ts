import { apiPost } from './request'

export function checkin(activity_id: number, checkin_code: string) {
  return apiPost<{ checkin_id: number; checkin_time: string }>(`/activities/${activity_id}/checkin`, {
    checkin_code,
  })
}
