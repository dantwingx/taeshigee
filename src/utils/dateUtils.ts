/**
 * 날짜 및 시간 포맷팅 유틸리티 함수들
 */

// 현재 사용자의 타임존 가져오기
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

// 로컬 날짜 포맷팅 (YYYY-MM-DD)
export const formatLocalDate = (dateString: string, locale: string = 'ko-KR') => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: getUserTimezone()
    })
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateString
  }
}

// 로컬 시간 포맷팅 (HH:MM)
export const formatLocalTime = (dateString: string, locale: string = 'ko-KR') => {
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: getUserTimezone()
    })
  } catch (error) {
    console.error('Time formatting error:', error)
    return dateString
  }
}

// 로컬 날짜+시간 포맷팅
export const formatLocalDateTime = (dateString: string, locale: string = 'ko-KR') => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: getUserTimezone()
    })
  } catch (error) {
    console.error('DateTime formatting error:', error)
    return dateString
  }
}

// 상대적 시간 표시 (예: "3분 전", "2시간 전")
export const formatRelativeTime = (dateString: string, locale: string = 'ko-KR') => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return '방금 전'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`
    } else {
      return formatLocalDate(dateString, locale)
    }
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return dateString
  }
}

// 마감일 포맷팅 (날짜 + 시간)
export const formatDueDateTime = (dateString: string, timeString?: string, locale: string = 'ko-KR') => {
  try {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      timeZone: getUserTimezone()
    })
    
    if (timeString) {
      return `${dateStr} ${timeString}`
    }
    return dateStr
  } catch (error) {
    console.error('Due date formatting error:', error)
    return dateString
  }
}

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환 (로컬 타임존 기준)
export const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 현재 시간을 HH:MM 형식으로 반환 (로컬 타임존 기준)
export const getCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 마지막 시간(23:59)을 HH:MM 형식으로 반환
export const getLastTimeOfDay = () => {
  return '23:59'
}

// 날짜가 오늘인지 확인
export const isToday = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// 날짜가 과거인지 확인
export const isPast = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  return date < now
}

// 날짜가 미래인지 확인
export const isFuture = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  return date > now
} 