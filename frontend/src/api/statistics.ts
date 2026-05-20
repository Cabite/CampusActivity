import { apiGet } from './request'
import type { PaginatedList, RankingItem } from '@/types/api'

export function getUserRanking(params?: {
  period?: string
  scope?: string
  filter_value?: string
  page?: number
  page_size?: number
}) {
  return apiGet<PaginatedList<RankingItem>>('/statistics/user-ranking', params as Record<string, unknown>)
}
