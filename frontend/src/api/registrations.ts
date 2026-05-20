import { apiDelete, apiGet, apiPost } from './request'
import type { PaginatedList, RegistrationItem } from '@/types/api'

export interface MyRegistrationsQuery {
  type?: 'upcoming' | 'past'
  page?: number
  page_size?: number
  keyword?: string
  activity_id?: number
  category_id?: number
  start_date?: string
  campus?: string
}

export function registerActivity(activity_id: number) {
  return apiPost<{ registration_id: number; status: string; remaining_slots: number }>(
    '/registrations',
    { activity_id },
  )
}

export function cancelRegistration(activity_id: number) {
  return apiDelete<{ release_time: string }>(`/registrations/${activity_id}`)
}

export function getMyRegistrations(params: MyRegistrationsQuery) {
  return apiGet<PaginatedList<RegistrationItem>>('/registrations/my', params as Record<string, unknown>)
}
