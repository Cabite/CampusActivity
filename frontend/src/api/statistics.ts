import { apiGet } from './request'
import type { PaginatedList, RankingItem } from '@/types/api'

export function getLeaderboard(params?: {
  period?: string
  college?: string
  grade?: string
  page?: number
  page_size?: number
}) {
  return apiGet<PaginatedList<RankingItem>>('/leaderboard', params as Record<string, unknown>)
}
