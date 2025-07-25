export default {
  // Common
  common: {
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    duplicate: 'Duplicate',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    close: 'Close',
    search: 'Search',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    yes: 'Yes',
    no: 'No',
    public: 'Public',
    private: 'Private',
    visibility: 'Visibility',
    all: 'All',
    none: 'None',
    today: 'Today',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    nextWeek: 'Next Week',
    overdue: 'Overdue',
    completed: 'Completed',
    incomplete: 'Incomplete',
    toggleComplete: 'Toggle complete',
    pending: 'Pending',
    inProgress: 'In Progress',
    reset: 'Reset',
    saving: 'Saving...',
    count: 'items',
    appName: 'Taeshigee',
    appDescription: 'A new experience in task management',
    justNow: "Just now",
    minutesAgo: "{{count}} minute(s) ago",
    hoursAgo: "{{count}} hour(s) ago",
    daysAgo: "{{count}} day(s) ago",
    sort: 'Sort',
    sortAsc: 'Ascending',
    sortDesc: 'Descending',
    addEmoji: 'Add Emoji',
    selectEmoji: 'Select Emoji',
    emojiCategory: {
      faces: 'Faces',
      animals: 'Animals',
      food: 'Food',
      activities: 'Activities',
      objects: 'Objects',
      symbols: 'Symbols'
    }
  },

  // Navigation
  navigation: {
    home: 'Home',
    tasks: 'Tasks',
    public: 'Public',
    my: 'My',
    myPage: 'My Page'
  },

  // Auth
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot your password?',
    signInWithGoogle: 'Sign in with Google',
    signUpWithGoogle: 'Sign up with Google',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    loginSuccess: 'Successfully logged in',
    registerSuccess: 'Registration completed successfully',
    logoutSuccess: 'Successfully logged out',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDoNotMatch: 'Passwords do not match',
    emailAlreadyExists: 'Email already exists',
    invalidCredentials: 'Invalid email or password',
    loggingIn: 'Logging in...',
    registering: 'Registering...',
    taskManager: 'Task Manager',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordPlaceholder: 'Confirm your password',
    emailPlaceholder: 'your@email.com',
    emailInvalid: "Please enter a valid email address.",
    passwordMin: "Password must be at least 6 characters.",
    confirmPasswordRequired: "Please confirm your password.",
    passwordsDontMatch: "Passwords do not match.",
    loginFailed: 'Login failed',
    registerFailed: 'Registration failed',
    networkError: 'Network error occurred',
    serverError: 'Server error occurred',
    unknownError: 'An unknown error occurred'
  },

  // Task
  task: {
    title: 'Title',
    description: 'Description',
    dueDate: 'Due Date',
    dueTime: 'Due Time',
    priority: 'Priority',
    importance: 'Importance',
    category: 'Category',
    tags: 'Tags',
    isPublic: 'Public',
    isCompleted: 'Completed',
    createTask: 'Create Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    duplicateTask: 'Duplicate Task',
    taskCreated: 'Task created successfully',
    taskUpdated: 'Task updated successfully',
    taskDeleted: 'Task deleted successfully',
    taskCompleted: 'Task marked as completed',
    taskUncompleted: 'Task marked as uncompleted',
    taskDuplicated: 'Task duplicated successfully',
    copySuffix: '(Copy)',
    totalTasksDisplay: '{{shown}} of {{total}} shown',
    confirmDeleteTask: 'Are you sure you want to delete this task?',
    noTasks: 'No tasks found',
    noTasksFound: 'No tasks found',
    addNewTask: 'Add New Task',
    searchTasks: 'Search tasks...',
    filterByStatus: 'Filter by Status',
    filterByPriority: 'Filter by Priority',
    filterByImportance: 'Filter by Importance',
    filterByCategory: 'Filter by Category',
    showCompleted: 'Show Completed',
    hideCompleted: 'Hide Completed',
    markAsCompleted: 'Mark as Completed',
    markAsUncompleted: 'Mark as Uncompleted',
    dueDateRequired: 'Due date is required',
    titleRequired: 'Title is required',
    descriptionPlaceholder: 'Enter task description...',
    tagsPlaceholder: 'Enter tags and press Enter...',
    tagsInputPlaceholder: 'Enter tags (separate with Enter or comma)',
    addTag: 'Add tag',
    removeTag: 'Remove tag',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    importanceHigh: 'Very Important',
    importanceMedium: 'Important',
    importanceLow: 'Normal',
    categoryWork: 'Work',
    categoryPersonal: 'Personal',
    categoryStudy: 'Study',
    categoryHealth: 'Health',
    categoryFinance: 'Finance',
    categoryOther: 'Other',
    statusFilter: 'Filter by Status',
    importanceFilter: 'Importance',
    priorityFilter: 'Priority',
    publicFilter: 'Public',
    createdAt: 'Created Date',
    update: 'Update',
    like: 'Like',
    unlike: 'Unlike',
    likeCount: '{{count}} likes',
    likeTask: 'Like Task',
    unlikeTask: 'Unlike Task',
    titleMaxLength: 'Title must be 100 characters or less',
    descriptionMaxLength: 'Description must be 500 characters or less',
    templateButton: 'Template',
    emojiButton: 'Emoji',
    completed: 'Completed',
    incomplete: 'Incomplete',
    toggleComplete: 'Toggle Complete',
  },

  // 홈
  home: {
    welcome: 'Welcome',
    todayTasks: 'Today\'s Tasks',
    todayUserTasks: 'My Today\'s Tasks',
    todayPublicTasks: 'Today\'s Public Tasks',
    upcomingTasks: 'Upcoming Tasks',
    recentTasks: 'Recent Tasks',
    taskStats: 'Task Statistics',
    totalTasks: 'Total Tasks',
    completedTasks: 'Completed Tasks',
    pendingTasks: 'Pending Tasks',
    overdueTasks: 'Overdue Tasks',
    completionRate: 'Completion Rate',
    noTasksToday: 'No tasks scheduled for today',
    noTodayUserTasks: 'No tasks scheduled for today',
    noTodayPublicTasks: 'No public tasks for today',
    noUpcomingTasks: 'No upcoming tasks',
    noRecentTasks: 'No recent tasks'
  },

  // Shared
  shared: {
    title: 'Public',
    publicTasks: 'Public Tasks',
    completedTasks: 'Completed Tasks',
    taskAnalytics: 'Task Analytics',
    completionTrends: 'Completion Trends',
    categoryDistribution: 'Category Distribution',
    priorityDistribution: 'Priority Distribution',
    importanceDistribution: 'Importance Distribution',
    weeklyProgress: 'Weekly Progress',
    monthlyProgress: 'Monthly Progress',
    noPublicTasks: 'No public tasks available',
    viewTaskDetails: 'View Task Details',
    createdBy: 'Created by',
    createdAt: 'Created at',
    completedAt: 'Completed at'
  },

  // Settings
  settings: {
    title: 'Settings',
    my: 'My',
    manageYourInfo: 'Manage your info and settings',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    switchToDarkTheme: 'Switch to dark theme',
    languageSettings: 'Language Settings',
    signUpDate: 'Sign Up Date',
    lastUpdate: 'Last Update',
    userId: 'User ID',
    accountSettings: 'Account Settings',
    notificationSettings: 'Notification Settings',
    privacySettings: 'Privacy Settings',
    about: 'About',
    version: 'Version',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    contactUs: 'Contact Us',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
    languageChanged: 'Language changed successfully',
    themeChanged: 'Theme changed successfully',
    showMore: 'Show more',
    showLess: 'Show less',
    changeUserId: 'Change User ID',
    userIdChanged: 'User ID changed successfully',
    userIdChangeFailed: 'Failed to change User ID',
    userIdAlreadyExists: 'User ID already exists',
    invalidUserIdFormat: 'User ID must be alphanumeric, 6 or more and less than 30 characters',
    enterUserId: 'Please enter a User ID',
    userIdPlaceholder: 'user_000001',
    name: 'Name',
    nameChangeFailed: 'Failed to change name',
    enterName: 'Please enter your name',
    darkModeEnabled: 'Dark mode enabled',
    darkModeDisabled: 'Dark mode disabled',
    darkModeChangeFailed: 'Failed to change dark mode',
    languageChangeFailed: 'Failed to change language',
    myAccount: 'My Account',
    appSettings: 'App Settings',
    accountManagement: 'Account Management',
    development: 'Development',
    email: 'Email',
    joinDate: 'Join Date',
    lastUpdated: 'Last Updated',
    language: 'Language',
    nameChanged: 'Name changed successfully',
    loggedOut: 'Logged out successfully',
    allDataCleared: 'All data cleared successfully',
    testAccountCreated: 'Test account created successfully',
    pleaseLogin: 'Please login first',
    createTestAccount: 'Create Test Account',
    clearAllData: 'Clear All Data'
  },

  // Task Template
  template: {
    selectTemplate: 'Select Task Template',
    searchTemplate: 'Search templates...',
    popularTemplates: 'Popular Templates',
    allTemplates: 'All Templates',
    categoryTemplates: '{{category}} Templates',
    days: 'days',
    category: {
      all: 'All',
      health: 'Health',
      study: 'Study',
      work: 'Work',
      hobby: 'Hobby',
      daily: 'Daily'
    }
  },

  // Toast messages
  toast: {
    taskCreated: 'Task created successfully',
    taskUpdated: 'Task updated successfully',
    taskDeleted: 'Task deleted successfully',
    taskCompleted: 'Task marked as completed',
    taskUncompleted: 'Task marked as uncompleted',
    taskDuplicated: 'Task duplicated successfully',
    loginSuccess: 'Logged in successfully',
    registerSuccess: 'Registration completed',
    logoutSuccess: 'Logged out successfully',
    languageChanged: 'Language changed successfully',
    themeChanged: 'Theme changed successfully',
    error: 'An error occurred',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    taskLiked: 'Task liked successfully',
    taskUnliked: 'Task unliked successfully',
    likeError: 'Failed to process like'
  },

  templateExamples: {
    diet3days: {
      name: '3-Day Diet',
      title: 'Diet with healthy meals for 3 days',
      description: 'Challenge yourself to lose weight by eating healthy for 3 days.',
      tags: ['3 days', 'Health', 'Diet'],
    },
    dietWeek: {
      name: '1-Week Diet',
      title: 'Consistent diet for 1 week',
      description: 'Manage your meals for a week to build a healthy body.',
      tags: ['7 days', 'Health', 'Diet'],
    },
    dietMonth: {
      name: '1-Month Diet',
      title: 'Systematic diet for 1 month',
      description: 'Achieve your goal with a systematic diet for 1 month.',
      tags: ['30 days', 'Health', 'Diet'],
    },
    exerciseDaily: {
      name: 'Daily Exercise',
      title: 'Exercise Daily',
      description: 'Create a healthy lifestyle by exercising for at least 30 minutes every day',
      tags: ['health', 'exercise', 'habit']
    },
    waterIntake: {
      name: 'Drink Water',
      title: 'Drink 2L of Water a Day',
      description: 'Drink more than 2L of water a day for a healthy body',
      tags: ['health', 'hydration', 'habit']
    },
    studyDaily: {
      name: 'Daily Study',
      title: 'Study Daily',
      description: 'Build knowledge by studying for at least 1 hour every day',
      tags: ['study', 'learning', 'habit']
    },
    languageStudy: {
      name: 'Language Study',
      title: 'Foreign Language Study',
      description: 'Improve your language skills by studying a foreign language for 30 minutes every day',
      tags: ['study', 'language', 'foreign']
    },
    workPlanning: {
      name: 'Work Planning',
      title: 'Plan Your Work',
      description: 'Plan and execute your work every day',
      tags: ['work', 'planning', 'productivity']
    },
    skillImprovement: {
      name: 'Skill Improvement',
      title: 'Improve Technical Skills',
      description: 'Learn new skills and apply them to your work',
      tags: ['work', 'skills', 'development']
    },
    reading: {
      name: 'Reading',
      title: 'Read Books',
      description: 'Read books for at least 30 minutes every day',
      tags: ['hobby', 'reading', 'knowledge']
    },
    musicPractice: {
      name: 'Music Practice',
      title: 'Practice Music',
      description: 'Improve your musical skills by practicing an instrument every day',
      tags: ['hobby', 'music', 'practice']
    },
    earlySleep: {
      name: 'Go to Bed Early',
      title: 'Go to Bed Early',
      description: 'Go to bed before 11 PM every day',
      tags: ['daily', 'sleep', 'health']
    },
    gratitude: {
      name: 'Gratitude Journal',
      title: 'Write a Gratitude Journal',
      description: 'Write down 3 things you are grateful for every day',
      tags: ['daily', 'gratitude', 'mind']
    }
  }
}; 