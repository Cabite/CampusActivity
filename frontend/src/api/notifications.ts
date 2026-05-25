import { apiGet, apiPut } from './request'
import type { AnnouncementItem, NotificationItem, PaginatedList } from '@/types/api'

export function getNotifications(params?: { page?: number; page_size?: number }) {
  return apiGet<PaginatedList<NotificationItem> & { unread_count: number }>(
    '/notifications',
    params as Record<string, unknown>,
  )
}

export function markNotificationRead(id: number) {
  return apiPut<null>(`/notifications/${id}/read`)
}

export function getAnnouncements() {
  return apiGet<AnnouncementItem[]>('/announcements')
}
