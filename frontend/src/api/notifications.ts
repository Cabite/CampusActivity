import { apiGet, apiPut } from './request'
import type { AnnouncementItem, NotificationItem, PaginatedList } from '@/types/api'

export function getNotifications(params?: {
  type?: string
  unread_only?: boolean
  page?: number
  page_size?: number
}) {
  return apiGet<PaginatedList<NotificationItem> & { unread_count: number }>(
    '/notifications',
    params as Record<string, unknown>,
  )
}

export function markNotificationRead(id: number) {
  return apiPut<null>(`/notifications/${id}/read`)
}

export function markAllNotificationsRead() {
  return apiPut<null>('/notifications/read-all')
}

export function getAnnouncements() {
  return apiGet<AnnouncementItem[]>('/announcements')
}
