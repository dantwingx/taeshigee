export default {
  // 공통
  common: {
    create: '생성',
    edit: '수정',
    delete: '삭제',
    duplicate: '복제',
    cancel: '취소',
    save: '저장',
    confirm: '확인',
    close: '닫기',
    search: '검색',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    success: '성공했습니다',
    yes: '예',
    no: '아니오',
    public: '공개',
    private: '비공개',
    all: '전체',
    none: '없음',
    today: '오늘',
    tomorrow: '내일',
    thisWeek: '이번 주',
    nextWeek: '다음 주',
    overdue: '기한 초과',
    completed: '완료됨',
    pending: '대기 중',
    inProgress: '진행 중',
    reset: '초기화',
    saving: '저장 중...',
    count: '개',
    appName: 'Taeshigee',
    appDescription: '태스크 관리의 새로운 경험',
    justNow: '방금 전',
    minutesAgo: '{{count}}분 전',
    hoursAgo: '{{count}}시간 전',
    daysAgo: '{{count}}일 전'
  },

  // 네비게이션
  navigation: {
    home: '홈',
    tasks: '태스크',
    public: '공개',
    my: '내정보',
  },

  // 인증
  auth: {
    login: '로그인',
    register: '회원가입',
    logout: '로그아웃',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    forgotPassword: '비밀번호를 잊으셨나요?',
    signInWithGoogle: 'Google로 로그인',
    signUpWithGoogle: 'Google로 회원가입',
    alreadyHaveAccount: '이미 계정이 있으신가요?',
    dontHaveAccount: '계정이 없으신가요?',
    loginSuccess: '로그인되었습니다',
    registerSuccess: '회원가입이 완료되었습니다',
    logoutSuccess: '로그아웃되었습니다',
    invalidEmail: '유효하지 않은 이메일입니다',
    passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다',
    passwordsDoNotMatch: '비밀번호가 일치하지 않습니다',
    emailAlreadyExists: '이미 존재하는 이메일입니다',
    invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다',
    loggingIn: '로그인 중...',
    registering: '회원가입 중...',
    taskManager: 'Task Manager',
    passwordPlaceholder: '비밀번호를 입력하세요',
    confirmPasswordPlaceholder: '비밀번호를 다시 입력하세요',
    emailPlaceholder: 'your@email.com',
    emailInvalid: "올바른 이메일 주소를 입력해주세요",
    passwordMin: "비밀번호는 최소 6자 이상이어야 합니다",
    confirmPasswordRequired: "비밀번호 확인을 입력해주세요",
    passwordsDontMatch: "비밀번호가 일치하지 않습니다"
  },

  // 태스크
  task: {
    title: '제목',
    description: '설명',
    dueDate: '마감일',
    dueTime: '마감 시간',
    priority: '우선순위',
    importance: '중요도',
    category: '카테고리',
    tags: '태그',
    isPublic: '공개 여부',
    isCompleted: '완료 여부',
    createTask: '태스크 생성',
    editTask: '태스크 수정',
    deleteTask: '태스크 삭제',
    taskCreated: '태스크가 생성되었습니다',
    taskUpdated: '태스크가 수정되었습니다',
    taskDeleted: '태스크가 삭제되었습니다',
    taskCompleted: '태스크가 완료되었습니다',
    taskUncompleted: '태스크가 미완료로 변경되었습니다',
    taskDuplicated: '태스크가 복제되었습니다',
    copySuffix: '(복사본)',
    totalTasksDisplay: '{{total}}개 중 {{shown}}개 표시',
    confirmDeleteTask: '이 태스크를 삭제하시겠습니까?',
    duplicateTask: '태스크 복제',
    noTasks: '태스크가 없습니다',
    noTasksFound: '검색 결과가 없습니다',
    addNewTask: '새 태스크 추가',
    searchTasks: '태스크 검색...',
    filterByStatus: '상태별 필터',
    filterByPriority: '우선순위별 필터',
    filterByImportance: '중요도별 필터',
    filterByCategory: '카테고리별 필터',
    showCompleted: '완료된 태스크 표시',
    hideCompleted: '완료된 태스크 숨기기',
    markAsCompleted: '완료로 표시',
    markAsUncompleted: '미완료로 표시',
    dueDateRequired: '마감일을 입력해주세요',
    titleRequired: '제목을 입력해주세요',
    descriptionPlaceholder: '태스크 설명을 입력하세요...',
    tagsPlaceholder: '태그를 입력하고 Enter를 누르세요...',
    tagsInputPlaceholder: '태그를 입력하세요 (Enter 또는 쉼표로 구분)',
    addTag: '태그 추가',
    removeTag: '태그 제거',
    priorityHigh: '높음',
    priorityMedium: '보통',
    priorityLow: '낮음',
    importanceHigh: '매우 중요',
    importanceMedium: '중요',
    importanceLow: '보통',
    categoryWork: '업무',
    categoryPersonal: '개인',
    categoryStudy: '학습',
    categoryHealth: '건강',
    categoryFinance: '재정',
    categoryOther: '기타',
    statusFilter: '상태별 필터',
    importanceFilter: '중요도',
    priorityFilter: '우선순위',
    publicFilter: '공개여부',
    createdAt: '작성일',
    update: '수정',
    like: '좋아요',
    unlike: '좋아요 취소',
    likeCount: '좋아요 {{count}}개',
    likeTask: '태스크 좋아요',
    unlikeTask: '좋아요 취소'
  },

  // 홈
  home: {
    welcome: '환영합니다',
    todayTasks: '오늘의 태스크',
    todayUserTasks: '내 오늘 태스크',
    todayPublicTasks: '오늘의 공개 태스크',
    upcomingTasks: '예정된 태스크',
    recentTasks: '최근 태스크',
    taskStats: '태스크 통계',
    totalTasks: '전체 태스크',
    completedTasks: '완료된 태스크',
    pendingTasks: '대기 중인 태스크',
    overdueTasks: '기한 초과 태스크',
    completionRate: '완료율',
    noTasksToday: '오늘 예정된 태스크가 없습니다',
    noTodayUserTasks: '오늘 예정된 내 태스크가 없습니다',
    noTodayPublicTasks: '오늘의 공개 태스크가 없습니다',
    noUpcomingTasks: '예정된 태스크가 없습니다',
    noRecentTasks: '최근 태스크가 없습니다'
  },

  // 공유
  shared: {
    title: '공개',
    publicTasks: '공개 태스크',
    completedTasks: '완료된 태스크',
    taskAnalytics: '태스크 분석',
    completionTrends: '완료 추이',
    categoryDistribution: '카테고리 분포',
    priorityDistribution: '우선순위 분포',
    importanceDistribution: '중요도 분포',
    weeklyProgress: '주간 진행률',
    monthlyProgress: '월간 진행률',
    noPublicTasks: '공개된 태스크가 없습니다',
    viewTaskDetails: '태스크 상세보기',
    createdBy: '작성자',
    createdAt: '작성일',
    completedAt: '완료일'
  },

  // 설정
  settings: {
    title: '설정',
    my: '마이',
    manageYourInfo: '내 정보와 설정을 관리하세요',
    darkMode: '다크모드',
    switchToDarkTheme: '어두운 테마로 변경',
    languageSettings: '언어 설정',
    signUpDate: '가입일',
    lastUpdate: '마지막 업데이트',
    userId: '사용자 ID',
    accountSettings: '계정 설정',
    notificationSettings: '알림 설정',
    privacySettings: '개인정보 설정',
    about: '정보',
    version: '버전',
    termsOfService: '이용약관',
    privacyPolicy: '개인정보처리방침',
    contactUs: '문의하기',
    logout: '로그아웃',
    confirmLogout: '로그아웃하시겠습니까?',
    languageChanged: '언어가 변경되었습니다',
    themeChanged: '테마가 변경되었습니다',
    showMore: '더 보기',
    showLess: '접기',
    changeUserId: '사용자 ID 변경',
    userIdChanged: '사용자 ID가 변경되었습니다',
    userIdChangeFailed: '사용자 ID 변경에 실패했습니다',
    userIdAlreadyExists: '이미 사용 중인 사용자 ID입니다',
    invalidUserIdFormat: '사용자 ID는 영문+숫자 6자 이상 30자 미만이어야 합니다',
    enterUserId: '사용자 ID를 입력해주세요',
    userIdPlaceholder: 'user_000001',
    name: '이름',
    nameChangeFailed: '이름 변경에 실패했습니다',
    enterName: '이름을 입력해주세요',
    darkModeEnabled: '다크모드가 활성화되었습니다',
    darkModeDisabled: '다크모드가 비활성화되었습니다',
    darkModeChangeFailed: '다크모드 변경에 실패했습니다',
    languageChangeFailed: '언어 변경에 실패했습니다',
    myAccount: '내 계정',
    appSettings: '앱 설정',
    accountManagement: '계정 관리',
    development: '개발 도구',
    email: '이메일',
    joinDate: '가입일시',
    lastUpdated: '마지막 업데이트',
    language: '언어',
    nameChanged: '이름이 변경되었습니다',
    userIdChanged: '사용자 ID가 변경되었습니다',
    loggedOut: '로그아웃되었습니다',
    allDataCleared: '모든 데이터가 삭제되었습니다',
    testAccountCreated: '테스트 계정이 생성되었습니다',
    pleaseLogin: '로그인이 필요합니다',
    createTestAccount: '테스트 계정 생성',
    clearAllData: '모든 데이터 삭제'
  },

  // 토스트 메시지
  toast: {
    taskCreated: '태스크가 생성되었습니다',
    taskUpdated: '태스크가 수정되었습니다',
    taskDeleted: '태스크가 삭제되었습니다',
    taskCompleted: '태스크가 완료되었습니다',
    taskUncompleted: '태스크가 미완료로 변경되었습니다',
    taskDuplicated: '태스크가 복제되었습니다',
    loginSuccess: '로그인되었습니다',
    registerSuccess: '회원가입이 완료되었습니다',
    logoutSuccess: '로그아웃되었습니다',
    languageChanged: '언어가 변경되었습니다',
    themeChanged: '테마가 변경되었습니다',
    error: '오류가 발생했습니다',
    success: '성공했습니다',
    warning: '경고',
    info: '정보',
    taskLiked: '태스크를 좋아요했습니다',
    taskUnliked: '좋아요를 취소했습니다',
    likeError: '좋아요 처리에 실패했습니다'
  }
}; 