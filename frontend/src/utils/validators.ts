export function isStudentId(value: string) {
  return /^\d{10}$/.test(value)
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isUsername(value: string) {
  return /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/.test(value)
}

export function isPassword(value: string) {
  return value.length >= 6 && value.length <= 20
}

export function isPhone(value: string) {
  return value === '' || /^1\d{10}$/.test(value)
}
