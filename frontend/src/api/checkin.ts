import { apiGet, apiPost } from './request'
import type { CheckinsData } from '@/types/api'

export interface MyCheckinsQuery {
  page?: number
  page_size?: number
  category_id?: number
  /** 活动名称模糊搜索 */
  name?: string
  activity_id?: number
  start_date?: string
  campus?: string
}

export function checkin(activity_id: number, checkin_code: string) {
  return apiPost<{ checkin_id: number; checkin_time: string }>(`/activities/${activity_id}/checkin`, {
    checkin_code,
  })
}

/** 获取我的签到记录 */
export function getMyCheckins(params?: MyCheckinsQuery) {
  return apiGet<CheckinsData>('/user/checkins', params as Record<string, unknown>)
}
