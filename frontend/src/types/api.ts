export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedList<T> {
  total: number
  page: number
  page_size: number
  list: T[]
}

export interface LoginData {
  token: string
  user_id: number
  role: string
  expires_in: number
}

/** 注册成功自动登录 */
export interface RegisterData {
  userId: number
  token: string
}

export interface UserProfile {
  user_id: number
  student_id: string
  email: string
  username: string
  avatar?: string
  gender: string
  college: string
  major: string
  grade: string
  phone?: string
  status: string
  achievement?: {
    title: string
    effective_participation_count: number
  }
}

export interface ActivityListItem {
  activity_id: number
  name: string
  start_time: string
  end_time?: string
  category_name: string
  category_path?: string
  location: string
  campus: string
  current_participants: number
  max_participants: number
  status?: string
}

export interface ActivityDetail extends ActivityListItem {
  organizer_id: number
  organizer_name: string
  category_id: number
  end_time: string
  registration_deadline: string
  cancel_deadline: string
  description: string
  status: string
  is_registered: boolean
  registration_status: string | null
  /** 当前用户是否已签到 */
  check_status?: boolean | string
}

export interface CategoryNode {
  id: number
  name: string
  level: number
  sort_order: number
  children?: CategoryNode[]
}

export interface RegistrationItem {
  registration_id: number
  activity_id: number
  activity_name: string
  start_time: string
  end_time: string
  location?: string
  registration_time: string
  status: string
  checkin_status: 'checked' | 'not_checked'
  checkin_time?: string | null
}

export interface NotificationItem {
  notification_id: number
  title: string
  content: string
  type: string
  related_id?: number
  is_read: boolean
  created_at: string
}

export interface AnnouncementItem {
  announcement_id: number
  title: string
  content: string
  start_time: string
  end_time: string
}

export interface RankingItem {
  rank: number
  user_id: number
  username?: string
  student_id: string
  college: string
  grade: string
  registration_count?: number
  effective_participation_count: number
}
