import { apiGet } from './request'
import type { LeaderboardData } from '@/types/api'

export function getLeaderboard(params?: {
  period?: string
  college?: string
  grade?: string
  page?: number
  page_size?: number
}) {
  return apiGet<LeaderboardData>('/leaderboard', params as Record<string, unknown>)
}
