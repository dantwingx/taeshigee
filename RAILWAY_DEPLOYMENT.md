# Railway 배포 가이드

## 프론트엔드 배포 (React + Vite)

### 1. Railway CLI 설치
```bash
npm install -g @railway/cli
```

### 2. Railway 로그인
```bash
railway login
```

### 3. 프로젝트 초기화
```bash
# 프로젝트 루트 디렉토리에서
railway init
```

### 4. 환경 변수 설정
Railway 대시보드에서 다음 환경 변수를 설정:

```env
# 백엔드 API URL (실제 백엔드 서비스 URL로 변경)
VITE_API_BASE_URL=https://your-backend-service-name.up.railway.app

# 기타 필요한 환경 변수들
NODE_ENV=production
```

### 5. 배포
```bash
railway up
```

### 6. 도메인 설정 (선택사항)
Railway 대시보드에서 커스텀 도메인을 설정할 수 있습니다.

## 백엔드 배포 (이미 완료됨)

백엔드는 이미 Railway에 배포되어 있습니다:
- URL: `https://backend-api-production-44d2.up.railway.app`

## 배포 후 확인사항

1. **프론트엔드 URL 확인**: Railway 대시보드에서 생성된 URL 확인
2. **API 연결 테스트**: 프론트엔드에서 백엔드 API 호출 테스트
3. **CORS 설정 확인**: 백엔드에서 프론트엔드 도메인 허용 확인

## 문제 해결

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build
```

### 환경 변수 문제
- Railway 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
- `VITE_` 접두사가 붙은 변수만 프론트엔드에서 접근 가능

### API 연결 문제
- 백엔드 URL이 올바른지 확인
- CORS 설정이 프론트엔드 도메인을 허용하는지 확인

## 모니터링

Railway 대시보드에서 다음을 모니터링할 수 있습니다:
- 배포 상태
- 로그
- 리소스 사용량
- 에러 발생 여부 