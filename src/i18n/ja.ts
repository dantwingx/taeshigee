export default {
  // 共通
  common: {
    create: "作成",
    edit: "編集",
    delete: "削除",
    duplicate: "複製",
    cancel: "キャンセル",
    save: '保存',
    confirm: '確認',
    close: '閉じる',
    search: '検索',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    success: '成功',
    yes: 'はい',
    no: 'いいえ',
    emojiCategory: {
      faces: '表情',
      animals: '動物',
      food: '食べ物',
      activities: 'アクティビティ',
      objects: '物',
      symbols: '記号'
    },
    copySuffix: '(コピー)',
    visibility: '公開範囲',
    private: '非公開',
    public: '公開',
    all: 'すべて',
    none: 'なし',
    today: '今日',
    tomorrow: '明日',
    thisWeek: '今週',
    nextWeek: '来週',
    overdue: '期限切れ',
    completed: '完了',
    incomplete: '未完了',
    toggleComplete: '完了状態を切り替え',
    pending: '保留中',
    inProgress: '進行中',
    reset: 'リセット',
    saving: '保存中...',
    count: '件',
    appName: 'Taeshigee',
    appDescription: 'タスク管理の新しい体験',
    justNow: "今",
    minutesAgo: "{{count}}分前",
    hoursAgo: "{{count}}時間前",
    daysAgo: "{{count}}日前",
    sort: '並び替え',
    sortAsc: '昇順',
    sortDesc: '降順',
    addEmoji: '絵文字を追加',
    selectEmoji: '絵文字を選択',
  },

  // ナビゲーション
  navigation: {
    home: 'ホーム',
    tasks: 'タスク',
    public: '公開',
    my: 'マイ',
  },

  // 認証
  auth: {
    login: "ログイン",
    register: "登録",
    logout: "ログアウト",
    email: "メールアドレス",
    password: "パスワード",
    confirmPassword: "パスワード確認",
    forgotPassword: "パスワードを忘れた方",
    signInWithGoogle: "Googleでログイン",
    signUpWithGoogle: "Googleで登録",
    alreadyHaveAccount: "すでにアカウントをお持ちですか？",
    dontHaveAccount: "アカウントをお持ちでない方",
    loginSuccess: "ログインしました",
    registerSuccess: "登録が完了しました",
    logoutSuccess: "ログアウトしました",
    invalidEmail: "無効なメールアドレスです",
    passwordTooShort: "パスワードは6文字以上である必要があります",
    passwordsDoNotMatch: "パスワードが一致しません",
    emailAlreadyExists: "メールアドレスは既に存在します",
    invalidCredentials: "メールアドレスまたはパスワードが無効です",
    loggingIn: "ログイン中...",
    registering: "登録中...",
    taskManager: "タスクマネージャー",
    passwordPlaceholder: "パスワードを入力してください",
    confirmPasswordPlaceholder: "パスワードを確認してください",
    emailPlaceholder: "your@email.com",
    emailInvalid: "有効なメールアドレスを入力してください。",
    passwordMin: "パスワードは6文字以上である必要があります。",
    confirmPasswordRequired: "パスワードを確認してください。",
    passwordsDontMatch: "パスワードが一致しません。",
    loginFailed: 'ログインに失敗しました',
    registerFailed: '登録に失敗しました',
    networkError: 'ネットワークエラー',
    serverError: 'サーバーエラー',
    unknownError: '不明なエラー'
  },

  // タスク
  task: {
    title: "タイトル",
    sharedTitle: "共有",
    description: "説明",
    dueDate: "期限日",
    dueTime: "期限時間",
    priority: "優先度",
    importance: "重要度",
    category: "カテゴリ",
    tags: "タグ",
    isPublic: "公開",
    isCompleted: "完了",
    createTask: "タスクを作成",
    editTask: "タスクを編集",
    deleteTask: "タスクを削除",
    taskCreated: "タスクが作成されました",
    taskUpdated: "タスクが更新されました",
    taskDeleted: "タスクが削除されました",
    taskCompleted: "タスクが完了としてマークされました",
    taskUncompleted: "タスクが未完了としてマークされました",
    taskDuplicated: "タスクが複製されました",
    copySuffix: '(コピー)',
    totalTasksDisplay: '{{total}}件中{{shown}}件を表示',
    confirmDeleteTask: "このタスクを削除してもよろしいですか？",
    noTasks: "タスクがありません",
    noTasksFound: "結果が見つかりません",
    addNewTask: "新しいタスクを追加",
    searchTasks: "タスクを検索...",
    filterByStatus: "ステータスでフィルター",
    filterByPriority: "優先度でフィルター",
    filterByImportance: "重要度でフィルター",
    filterByCategory: "カテゴリでフィルター",
    showCompleted: "完了したタスクを表示",
    hideCompleted: "完了したタスクを非表示",
    markAsCompleted: "完了としてマーク",
    markAsUncompleted: "未完了としてマーク",
    dueDateRequired: "期限日を入力してください",
    titleRequired: "タイトルを入力してください",
    descriptionPlaceholder: "タスクの説明を入力...",
    tagsPlaceholder: "タグを入力してEnterを押してください...",
    tagsInputPlaceholder: "タグを入力（Enterまたはカンマで区切り）",
    addTag: "タグを追加",
    removeTag: "タグを削除",
    priorityHigh: "高",
    priorityMedium: "中",
    priorityLow: "低",
    importanceHigh: "非常に重要",
    importanceMedium: "重要",
    importanceLow: "通常",
    categoryWork: "仕事",
    categoryPersonal: "個人",
    categoryStudy: "学習",
    categoryHealth: "健康",
    categoryFinance: "財務",
    categoryOther: "その他",
    statusFilter: "ステータスでフィルター",
    importanceFilter: "重要度",
    priorityFilter: "優先度",
    publicFilter: "公開",
    createdAt: "作成日",
    update: "更新",
    titleMaxLength: 'タイトルは100文字未満である必要があります',
    descriptionMaxLength: '説明は500文字未満である必要があります',
    templateButton: 'テンプレート',
    emojiButton: '絵文字',
  },

  // ホーム
  home: {
    welcome: 'ようこそ',
    todayTasks: '今日のタスク',
    todayUserTasks: '今日の私のタスク',
    todayPublicTasks: '今日の公開タスク',
    upcomingTasks: '今後のタスク',
    recentTasks: '最近のタスク',
    taskStats: 'タスク統計',
    totalTasks: 'タスク総数',
    completedTasks: '完了したタスク',
    pendingTasks: '保留中のタスク',
    overdueTasks: '期限切れのタスク',
    completionRate: '完了率',
    noTasksToday: '今日予定されているタスクはありません',
    noUpcomingTasks: '今後のタスクはありません',
    noRecentTasks: '最近のタスクはありません',
    noTodayUserTasks: '今日予定されているタスクはありません',
    noTodayPublicTasks: '今日の公開タスクはありません'
  },

  // 共有
  shared: {
    title: '公開',
    publicTasks: '公開タスク',
    completedTasks: '完了したタスク',
    taskAnalytics: 'タスク分析',
    completionTrends: '完了トレンド',
    categoryDistribution: 'カテゴリ分布',
    priorityDistribution: '優先度分布',
    importanceDistribution: '重要度分布',
    weeklyProgress: '週間進捗',
    monthlyProgress: '月間進捗',
    noPublicTasks: '利用可能な公開タスクがありません',
    viewTaskDetails: "タスクの詳細を表示",
    createdBy: "作成者",
    createdAt: "作成日",
    completedAt: '完了日'
  },

  // 設定
  settings: {
    title: "設定",
    my: "マイ",
    manageYourInfo: '情報と設定を管理',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    switchToDarkTheme: 'ダークテーマに切り替え',
    languageSettings: '言語設定',
    signUpDate: '登録日',
    lastUpdate: '最終更新',
    userId: 'ユーザーID',
    accountSettings: 'アカウント設定',
    notificationSettings: '通知設定',
    privacySettings: 'プライバシー設定',
    about: 'アプリについて',
    version: 'バージョン',
    termsOfService: '利用規約',
    privacyPolicy: 'プライバシーポリシー',
    contactUs: 'お問い合わせ',
    logout: 'ログアウト',
    confirmLogout: 'ログアウトしてもよろしいですか？',
    languageChanged: '言語が正常に変更されました',
    themeChanged: 'テーマが正常に変更されました',
    showMore: 'もっと見る',
    showLess: '閉じる',
    changeUserId: 'ユーザーIDを変更',
    userIdChanged: 'ユーザーIDが正常に変更されました',
    userIdChangeFailed: 'ユーザーIDの変更に失敗しました',
    userIdAlreadyExists: 'ユーザーIDは既に存在します',
    invalidUserIdFormat: 'ユーザーIDは英数字で6文字以上30文字未満である必要があります',
    enterUserId: 'ユーザーIDを入力してください',
    userIdPlaceholder: 'user_000001',
    name: '名前',
    nameChangeFailed: '名前の変更に失敗しました',
    enterName: '名前を入力してください',
    darkModeEnabled: 'ダークモードが有効になりました',
    darkModeDisabled: 'ダークモードが無効になりました',
    darkModeChangeFailed: 'ダークモードの変更に失敗しました',
    languageChangeFailed: '言語の変更に失敗しました',
    myAccount: 'マイアカウント',
    appSettings: 'アプリ設定',
    accountManagement: 'アカウント管理',
    development: '開発',
    email: 'メールアドレス',
    joinDate: '登録日',
    lastUpdated: '最終更新',
    language: '言語',
    nameChanged: '名前が正常に変更されました',
    loggedOut: '正常にログアウトしました',
    allDataCleared: 'すべてのデータが正常にクリアされました',
    testAccountCreated: 'テストアカウントが正常に作成されました',
    pleaseLogin: 'まずログインしてください',
    createTestAccount: 'テストアカウントを作成',
    clearAllData: 'すべてのデータをクリア'
  },

  // タスクテンプレート
  template: {
    selectTemplate: 'タスクテンプレートを選択',
    searchTemplate: 'テンプレートを検索...',
    popularTemplates: '人気のテンプレート',
    allTemplates: 'すべてのテンプレート',
    categoryTemplates: '{{category}}テンプレート',
    days: '日',
    category: {
      all: 'すべて',
      health: '健康',
      study: '学習',
      work: '仕事',
      hobby: '趣味',
      daily: '日常'
    }
  },

  // トーストメッセージ
  toast: {
    taskCreated: 'タスクが正常に作成されました',
    taskUpdated: 'タスクが正常に更新されました',
    taskDeleted: 'タスクが正常に削除されました',
    taskCompleted: 'タスクが完了としてマークされました',
    taskUncompleted: 'タスクが未完了としてマークされました',
    taskDuplicated: 'タスクが正常に複製されました',
    loginSuccess: '正常にログインしました',
    registerSuccess: '登録が完了しました',
    logoutSuccess: '正常にログアウトしました',
    languageChanged: '言語が正常に変更されました',
    themeChanged: 'テーマが正常に変更されました',
    error: 'エラーが発生しました',
    success: '成功',
    warning: '警告',
    info: '情報',
    taskLiked: 'タスクが正常にいいねされました',
    taskUnliked: 'いいねが正常に削除されました',
    likeError: 'いいねの処理に失敗しました'
  },

  templateExamples: {
    diet3days: {
      name: '3日ダイエット',
      title: '3日間の健康的な食事によるダイエット',
      description: '3日間健康的に食べて体重を減らすことに挑戦してください。',
      tags: ['3日', '健康', 'ダイエット'],
    },
    dietWeek: {
      name: '1週間ダイエット',
      title: '1週間の継続的なダイエット',
      description: '1週間食事を管理して健康的な体を作りましょう。',
      tags: ['7日', '健康', 'ダイエット'],
    },
    dietMonth: {
      name: '1ヶ月ダイエット',
      title: '1ヶ月の体系的なダイエット',
      description: '1ヶ月の体系的なダイエットで目標を達成しましょう。',
      tags: ['30日', '健康', 'ダイエット'],
    },
    exerciseDaily: {
      name: '毎日運動',
      title: '毎日運動',
      description: '毎日30分以上運動して健康的な生活を作りましょう',
      tags: ['健康', '運動', '習慣']
    },
    waterIntake: {
      name: '水を飲む',
      title: '1日2Lの水を飲む',
      description: '1日に2L以上の水を飲んで健康的な体を作りましょう',
      tags: ['健康', '水分補給', '習慣']
    },
    studyDaily: {
      name: '毎日勉強',
      title: '毎日勉強',
      description: '毎日1時間以上勉強して知識を積み重ねましょう',
      tags: ['学習', '勉強', '習慣']
    },
    languageStudy: {
      name: '語学学習',
      title: '外国語学習',
      description: '毎日30分外国語を勉強して語学力を向上させましょう',
      tags: ['学習', '言語', '外国語']
    },
    workPlanning: {
      name: '仕事計画',
      title: '仕事を計画する',
      description: '毎日仕事を計画して実行しましょう',
      tags: ['仕事', '計画', '生産性']
    },
    skillImprovement: {
      name: 'スキル向上',
      title: '技術スキルを向上させる',
      description: '新しいスキルを学んで仕事に適用しましょう',
      tags: ['仕事', 'スキル', '開発']
    },
    reading: {
      name: '読書',
      title: '本を読む',
      description: '毎日30分以上本を読みましょう',
      tags: ['趣味', '読書', '知識']
    },
    musicPractice: {
      name: '音楽練習',
      title: '音楽を練習する',
      description: '毎日楽器を練習して音楽スキルを向上させましょう',
      tags: ['趣味', '音楽', '練習']
    },
    earlySleep: {
      name: '早寝',
      title: '早寝',
      description: '毎日23時前に就寝しましょう',
      tags: ['日常', '睡眠', '健康']
    },
    gratitude: {
      name: '感謝日記',
      title: '感謝日記を書く',
      description: '毎日感謝している3つのことを書き留めましょう',
      tags: ['日常', '感謝', '心']
    }
  }
}; 