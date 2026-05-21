import { apiGet } from './request'
import type { ActivityDetail, ActivityListItem, CategoryNode, PaginatedList } from '@/types/api'

export interface ActivityQuery {
  page?: number
  page_size?: number
  status?: string
  category_id?: number
  campus?: string
  keyword?: string
  activity_id?: number
  start_date?: string
}

export function getActivities(params: ActivityQuery) {
  return apiGet<PaginatedList<ActivityListItem>>('/activities', params as Record<string, unknown>)
}

export function getActivityDetail(id: number) {
  return apiGet<ActivityDetail>(`/activities/${id}`)
}

export function getCategories() {
  return apiGet<CategoryNode[]>('/categories')
}
