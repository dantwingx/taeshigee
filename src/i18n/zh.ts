export default {
  common: {
    create: "创建",
    edit: "编辑",
    delete: "删除",
    duplicate: "复制",
    cancel: "取消",
    save: "保存",
    confirm: "确认",
    close: "关闭",
    search: "搜索",
    loading: "加载中...",
    error: "发生错误",
    success: "成功",
    yes: "是",
    no: "否",
    public: "公开",
    private: "私有",
    all: "全部",
    none: "无",
    today: "今天",
    tomorrow: "明天",
    thisWeek: "本周",
    nextWeek: "下周",
    overdue: "逾期",
    completed: "已完成",
    pending: "待处理",
    inProgress: "进行中",
    reset: "重置",
    saving: "保存中...",
    count: "个",
    appName: "Taeshigee",
    appDescription: "任务管理的新体验",
    justNow: "刚刚",
    minutesAgo: "{{count}}分钟前",
    hoursAgo: "{{count}}小时前",
    daysAgo: "{{count}}天前"
  },

  navigation: {
    home: '首页',
    tasks: '任务',
    public: '公开',
    my: '我的',
  },

  auth: {
    login: "登录",
    register: "注册",
    logout: "登出",
    email: "邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    forgotPassword: "忘记密码？",
    signInWithGoogle: "使用Google登录",
    signUpWithGoogle: "使用Google注册",
    alreadyHaveAccount: "已有账户？",
    dontHaveAccount: "没有账户？",
    loginSuccess: "登录成功",
    registerSuccess: "注册成功",
    logoutSuccess: "登出成功",
    invalidEmail: "无效的邮箱地址",
    passwordTooShort: "密码至少需要6个字符",
    passwordsDoNotMatch: "密码不匹配",
    emailAlreadyExists: "邮箱已存在",
    invalidCredentials: "邮箱或密码错误",
    loggingIn: "登录中...",
    registering: "注册中...",
    taskManager: "任务管理器",
    passwordPlaceholder: "请输入密码",
    confirmPasswordPlaceholder: "请确认密码",
    emailPlaceholder: "your@email.com",
    emailInvalid: "请输入有效的电子邮件地址。",
    passwordMin: "密码至少需要6个字符。",
    confirmPasswordRequired: "请确认您的密码。",
    passwordsDontMatch: "两次输入的密码不一致。"
  },

  task: {
    title: "共享",
    sharedTitle: "共享",
    description: "描述",
    dueDate: "截止日期",
    dueTime: "截止时间",
    priority: "优先级",
    importance: "重要性",
    category: "分类",
    tags: "标签",
    isPublic: "公开",
    isCompleted: "已完成",
    createTask: "创建任务",
    editTask: "编辑任务",
    deleteTask: "删除任务",
    taskCreated: "任务已创建",
    taskUpdated: "任务已更新",
    taskDeleted: "任务已删除",
    taskCompleted: "任务已完成",
    taskUncompleted: "任务已标记为未完成",
    taskDuplicated: "任务已复制",
    copySuffix: '(副本)',
    totalTasksDisplay: '共{{total}}项，已显示{{shown}}项',
    confirmDeleteTask: "确定要删除此任务吗？",
    noTasks: "没有任务",
    noTasksFound: "未找到结果",
    addNewTask: "添加新任务",
    searchTasks: "搜索任务...",
    filterByStatus: "按状态筛选",
    filterByPriority: "按优先级筛选",
    filterByImportance: "按重要性筛选",
    filterByCategory: "按分类筛选",
    showCompleted: "显示已完成任务",
    hideCompleted: "隐藏已完成任务",
    markAsCompleted: "标记为已完成",
    markAsUncompleted: "标记为未完成",
    dueDateRequired: "请输入截止日期",
    titleRequired: "请输入标题",
    descriptionPlaceholder: "请输入任务描述...",
    tagsPlaceholder: "输入标签并按Enter...",
    tagsInputPlaceholder: "输入标签（用Enter或逗号分隔）",
    addTag: "添加标签",
    removeTag: "删除标签",
    priorityHigh: "高",
    priorityMedium: "中",
    priorityLow: "低",
    importanceHigh: "非常重要",
    importanceMedium: "重要",
    importanceLow: "一般",
    categoryWork: "工作",
    categoryPersonal: "个人",
    categoryStudy: "学习",
    categoryHealth: "健康",
    categoryFinance: "财务",
    categoryOther: "其他",
    statusFilter: "按状态筛选",
    importanceFilter: "重要性",
    priorityFilter: "优先级",
    publicFilter: "公开",
    createdAt: "创建日期",
    update: "更新"
  },

  // 홈
  home: {
    welcome: '欢迎',
    todayTasks: '今日任务',
    todayUserTasks: '我的今日任务',
    todayPublicTasks: '今日公开任务',
    upcomingTasks: '即将到来的任务',
    recentTasks: '最近任务',
    taskStats: '任务统计',
    totalTasks: '总任务数',
    completedTasks: '已完成任务',
    pendingTasks: '待处理任务',
    overdueTasks: '逾期任务',
    completionRate: '完成率',
    noTasksToday: '今天没有安排的任务',
    noUpcomingTasks: '没有即将到来的任务',
    noRecentTasks: '没有最近的任务',
    noTodayUserTasks: '今天没有安排的任务',
    noTodayPublicTasks: '今天没有公开任务'
  },

  // 共享
  shared: {
    title: '公开',
    publicTasks: '公开任务',
    completedTasks: '已完成任务',
    taskAnalytics: '任务分析',
    completionTrends: '完成趋势',
    categoryDistribution: '类别分布',
    priorityDistribution: '优先级分布',
    importanceDistribution: '重要性分布',
    weeklyProgress: '周进度',
    monthlyProgress: '月进度',
    noPublicTasks: '暂无公开任务',
    viewTaskDetails: "查看任务详情",
    createdBy: "创建者",
    createdAt: "创建日期",
    completedAt: '完成时间'
  },

  settings: {
    title: "设置",
    my: "我的",
    manageYourInfo: "管理您的信息和设置",
    darkMode: "深色模式",
    switchToDarkTheme: "切换到深色主题",
    languageSettings: "语言设置",
    signUpDate: "注册日期",
    lastUpdate: "最后更新",
    userId: "用户ID",
    accountSettings: "账户设置",
    notificationSettings: "通知设置",
    privacySettings: "隐私设置",
    about: "关于",
    version: "版本",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    contactUs: "联系我们",
    logout: "登出",
    confirmLogout: "确定要登出吗？",
    languageChanged: "语言已更改",
    themeChanged: "主题已更改",
    showMore: "显示更多",
    showLess: "收起",
    changeUserId: "更改用户ID",
    userIdChanged: "用户ID更改成功",
    userIdChangeFailed: "用户ID更改失败",
    userIdAlreadyExists: "用户ID已存在",
    invalidUserIdFormat: "用户ID必须是字母数字，6个或更多且少于30个字符",
    enterUserId: "请输入用户ID",
    userIdPlaceholder: "user_000001",
    name: "姓名",
    nameChangeFailed: "姓名更改失败",
    enterName: "请输入您的姓名",
    darkModeEnabled: "深色模式已启用",
    darkModeDisabled: "深色模式已禁用",
    darkModeChangeFailed: "深色模式更改失败",
    languageChangeFailed: "语言更改失败",
    myAccount: "我的账户",
    appSettings: "应用设置",
    accountManagement: "账户管理",
    development: "开发",
    email: "邮箱",
    joinDate: "注册日期",
    lastUpdated: "最后更新",
    language: "语言",
    nameChanged: "姓名更改成功",
    loggedOut: "登出成功",
    allDataCleared: "所有数据清除成功",
    testAccountCreated: "测试账户创建成功",
    pleaseLogin: "请先登录",
    createTestAccount: "创建测试账户",
    clearAllData: "清除所有数据"
  },

  toast: {
    taskCreated: "任务已创建",
    taskUpdated: "任务已更新",
    taskDeleted: "任务已删除",
    taskCompleted: "任务已完成",
    taskUncompleted: "任务已标记为未完成",
    taskDuplicated: "任务已复制",
    loginSuccess: "登录成功",
    registerSuccess: "注册成功",
    logoutSuccess: "登出成功",
    languageChanged: "语言已更改",
    themeChanged: "主题已更改",
    error: "发生错误",
    success: "成功",
    warning: "警告",
    info: "信息"
  }
}; 