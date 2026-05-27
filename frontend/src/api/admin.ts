import { apiGet, apiPost, apiPut, apiDelete } from './request'
import type { ActivityListItem, CategoryNode, UserProfile } from '@/types/api'

// ==================== 活动管理 ====================

// 获取活动列表（管理员视角）
export function getAdminActivities(params?: {
  page?: number
  page_size?: number
  status?: string
  category_id?: number
  keyword?: string
}) {
  return apiGet<{ items: ActivityListItem[]; total: number }>('/admin/activities', params)
}

// 获取活动详情
export function getActivityDetail(activityId: number) {
  return apiGet<ActivityListItem>(`/admin/activities/${activityId}`)
}

// 审核活动
export function auditActivity(
  activityId: number,
  status: 'approved' | 'rejected',
  remark?: string
) {
  return apiPost<null>(`/admin/activities/${activityId}/review`, { status, remark })
}

// 强制删除活动
export function deleteActivity(activityId: number) {
  return apiDelete<null>(`/admin/activities/${activityId}`)
}

// 获取活动报名列表
export function getActivityRegistrations(
  activityId: number,
  params?: { page?: number; page_size?: number; status?: string }
) {
  return apiGet<{ items: any[]; total: number }>(
    `/admin/activities/${activityId}/registrations`,
    params
  )
}

// ==================== 用户管理 ====================

// 获取用户列表
export function getUsers(params?: {
  page?: number
  page_size?: number
  role?: 'user' | 'organizer' | 'admin'
  status?: 'active' | 'banned' | 'pending'
  keyword?: string
}) {
  return apiGet<{ items: UserProfile[]; total: number }>('/admin/users', params)
}

// 获取用户详情
export function getUserDetail(userId: number) {
  return apiGet<UserProfile>(`/admin/users/${userId}`)
}

// 封禁/解封用户
export function updateUserStatus(userId: number, status: 'active' | 'banned') {
  return apiPut<null>(`/admin/users/${userId}/status`, { status })
}

// 重置用户密码（管理员）
export function resetUserPassword(userId: number, newPassword: string) {
  return apiPost<null>(`/admin/users/${userId}/reset-password`, { password: newPassword })
}

// 审核组织者注册
export function auditOrganizer(organizerId: number, status: 'approved' | 'rejected', remark?: string) {
  return apiPost<null>(`/admin/organizers/${organizerId}/audit`, { status, remark })
}

// 获取待审核组织者列表
export function getPendingOrganizers(params?: { page?: number; page_size?: number }) {
  return apiGet<{ items: any[]; total: number }>('/admin/organizers/pending', params)
}

// ==================== 分类管理 ====================

// 获取分类列表
export function getCategories() {
  return apiGet<CategoryNode[]>('/categories')
}

// 创建分类
export function createCategory(data: { name: string; parent_id?: number; sort_order?: number }) {
  return apiPost<CategoryNode>('/admin/categories', data)
}

// 更新分类
export function updateCategory(categoryId: number, data: { name?: string; sort_order?: number }) {
  return apiPut<CategoryNode>(`/admin/categories/${categoryId}`, data)
}

// 删除分类
export function deleteCategory(categoryId: number) {
  return apiDelete<null>(`/admin/categories/${categoryId}`)
}

// ==================== 统计看板 ====================

// 获取统计数据
export function getStatistics(params?: {
  start_date?: string
  end_date?: string
  campus?: string
}) {
  return apiGet<{
    total_users: number
    total_activities: number
    total_registrations: number
    activity_trend: Array<{ date: string; count: number }>
    category_distribution: Array<{ category: string; count: number }>
    campus_distribution: Array<{ campus: string; count: number }>
  }>('/admin/statistics', params)
}

// 审核活动（通过/拒绝）
export function reviewActivity(activityId: number, action: 'approve' | 'reject', rejectReason?: string) {
  return apiPut<{ activity_id: number; new_status: string }>(`/admin/activities/${activityId}/review`, {
    action,
    reject_reason: rejectReason,
  })
}

// 下架活动
export function removeActivity(activityId: number, reason: string) {
  return apiPut<null>(`/admin/activities/${activityId}/remove`, { reason })
}

// ==================== 公告管理 ====================

/**
 * 获取公告列表
 */
export function getAnnouncements() {
  return apiGet<any[]>('/announcements')
}

/**
 * 发布公告
 */
export function publishAnnouncement(data: { title: string; content: string; start_time?: string; end_time?: string }) {
  return apiPost<{ announcement_id: number }>('/admin/announcements', data)
}

/**
 * 删除公告（使用 removeAnnouncement 避免与可能的全局声明冲突）
 */
export function removeAnnouncement(id: number) {
  return apiDelete<null>(`/admin/announcements/${id}`)
}