# taeshigee

## 환경 설정

### 1. 환경 변수 설정

프로젝트를 실행하기 전에 환경 변수를 설정해야 합니다.

1. `env.example` 파일을 복사하여 `.env` 파일을 생성합니다:
```bash
cp env.example .env
```

2. `.env` 파일을 열어 실제 값으로 수정합니다:
```bash
# API Keys
API_KEY=your_actual_api_key
SECRET_KEY=your_actual_secret_key

# Database
DATABASE_URL=your_actual_database_url
DB_USERNAME=your_actual_username
DB_PASSWORD=your_actual_password

# 기타 필요한 환경 변수들...
```

### 2. 보안 주의사항

⚠️ **중요**: 다음 파일들은 절대 Git에 커밋하지 마세요:
- `.env` (실제 환경 변수 파일)
- `*.pem`, `*.key` (인증서 파일)
- `secrets/` 디렉토리
- 기타 민감한 정보가 포함된 파일

### 3. 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 프로젝트 구조

```
src/
├── components/     # 공통 컴포넌트
├── hooks/         # 커스텀 훅
├── utils/         # 유틸리티 함수
├── domains/       # 도메인별 기능
│   ├── user/      # 사용자 관련
│   ├── product/   # 상품 관련
│   └── order/     # 주문 관련
└── App.tsx        # 메인 앱 컴포넌트
```