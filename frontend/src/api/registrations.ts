import { apiDelete, apiGet, apiPost } from './request'
import type { PaginatedList, RegistrationItem } from '@/types/api'

export interface MyRegistrationsQuery {
  page?: number
  page_size?: number
  category_id?: number
  /** 活动名称模糊搜索 */
  name?: string
  activity_id?: number
  start_date?: string
  campus?: string
}

export function registerActivity(activity_id: number) {
  return apiPost<{ registration_id: number; status: string; remaining_slots: number }>(
    `/activities/${activity_id}/register`,
  )
}

export function cancelRegistration(activity_id: number) {
  return apiDelete<{ release_time: string }>(`/activities/${activity_id}/register`)
}

export function getMyRegistrations(params: MyRegistrationsQuery) {
  return apiGet<PaginatedList<RegistrationItem>>('/user/registrations', params as Record<string, unknown>)
}
