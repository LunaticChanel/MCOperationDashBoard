# Medical Glow 운영 대시보드 - 개발 진행 상황 (working.md)

이 문서는 Medical Glow 운영 대시보드(Operations Dashboard 2026) 프로젝트의 실시간 개발 기록 및 이력을 관리합니다.

---

## 📅 개발 일지 및 기록

### 2026-06-15
* **Next.js 16 + Tailwind CSS 프로젝트 초기화**
  * 비대화형 모드로 안전하게 Next.js 16 (React 19) TypeScript 기반 프로젝트를 `medical_project` 루트에 빌드 완료.
  * `@supabase/supabase-js`, `@supabase/ssr` 패키지 설치 완료.
* **Supabase Auth 기반 로그인 및 RBAC 승인 가드 인프라 구축**
  * 구글 로그인 버튼 컴포넌트 생성.
  * `public.profiles` 테이블과 연동되는 자동 트리거용 SQL 스키마 설계.
  * Next.js Middleware를 활용한 비승인 유저 격리 및 역할군별(`/admin`, `/nurse`) 라우트 통제 기능 구현.
  * `AuthProvider`, `useAuth`, `RoleGuard` 리액트 컨텍스트 및 가드 컴포넌트 구현 완료.
  * 최고 관리자(Admin) 전용 가입 승인 및 역할 변경 콘솔 페이지(`src/app/admin/approvals`) 구현 완료.
  * 코드베이스 전체의 린트(Lint) 검증 및 구문 정상화 패스 완료.
* **카테고리 1: 바로 사용 (Quick Tools) - 주간 회의록 (`meeting_minutes`) 구현 완료**
  * 날짜, 안건, 참석자, 상세 안건, 최종 결정 사항에 대한 CRUD 기능 구현.
  * `localStorage` 연계 데이터 영속화 기능 적용.
  * 대시보드 홈(`src/app/page.tsx`)에 바로 가기 카드 연동.
  * 린트 검증(React Purity 및 비동기 상태 변화 제약 준수) 패스 완료.
* **카테고리 1: 바로 사용 (Quick Tools) - 외국인 상담 통역기 (`interpreter`) 구현 완료**
  * 대만/홍콩 번체(Traditional Chinese) 및 병음(Pinyin) 상담 상용구 사전 구축.
  * 원내 기본 정보(주소, 연락처, 진료 시간) 1클릭 복사 리소스 구축.
  * 태블릿(iPad) 상담 환경을 위한 반응형 2컬럼 레이아웃 적용.
  * 대시보드 홈(`src/app/page.tsx`)에 바로 가기 카드 연동.
  * JSX 닫는 태그 오류 정정 및 Strict Type Assertion 적용으로 린트 검사 완전 통과.
* **카테고리 1: 바로 사용 (Quick Tools) - AI 상태 + 일정 (`calendar`) 구현 완료**
  * 6개의 원내 배치 AI 에이전트(알프레도, 자비스, 맥스, 녹스, 닉스, 캐스) 실시간 CPU/메모리(시뮬레이션) 및 모니터링 상태 대시보드 구축.
  * 에이전트 에러(Error) 발생 시 수동 재기동(Restart) 액션 핸들러 연동.
  * 구글 시트 및 식약처 API 등 자동화 작업을 위한 크론 스케줄 현황판 캘린더 데이터 구축.
  * 대시보드 홈(`src/app/page.tsx`)에 바로 가기 카드 연동 및 린트 완벽 통과.
* **카테고리 2: 진료 · 수가 (Medical & Pricing) - REVIV 수가표 (`menu`) 구현 완료**
  * 리프팅, 색소, 보톡스, 필러, 스킨부스터 등 전체 시술 카테고리화 가격 리스트 구축.
  * 5개 국어(한국어, 영어, 번체중문, 간체중문, 일본어) 및 한어병음(Pinyin) 실시간 뷰어 번역 기능 탑재.
  * 키워드 실시간 검색 및 필터링 시스템 탑재.
  * 대시보드 홈(`src/app/page.tsx`)에 가격표 바로 가기 카드 연동 및 린트 검사 통과.
* **브랜드명 및 테마 컬러 전면 교체 완료**
  * 인트라넷 브랜드명을 기존 `REVIV CLINIC`에서 **`Medical Glow`**로 변경.
  * 기존의 다크 골드(Amber/Gold) 컬러 톤을 **메디컬 감성의 하이테크 푸른색 계열(Electric Blue / Cyan)**로 전면 변경 적용.
  * 로그인, 승인 대기실, 홈 대시보드, 어드민 승인 패널, 회의록, 통역기, AI 모니터링, 수가표 등 전체 9개 파일의 CSS 클래스 및 그라디언트 테마 조율 완료.
  * 테마 변경 후 ESLint 최종 린트 통과 확인.
* **카테고리 2: 진료 · 수가 (Medical & Pricing) - 6월 이벤트 및 시즌별 이벤트 관리 (`events`) 구현 완료**
  * 개원 1주년 메인 이벤트, 대표원장 생일 특별 게릴라 특가, 모공 축제 등 유연한 가변성 프로모션 안내 카드보드 구현.
  * 진행 중, 예정됨, 마감됨, 게릴라 특가 등 진행 상태별 탭 필터링 및 카테고리(리프팅, 보톡스, 필러, 스킨케어) 교차 필터링 시스템 연계.
  * 대시보드 홈(`src/app/page.tsx`)에 이벤트 바로 가기 카드 연동 및 린트 검사 통과.
* **카테고리 3: 간호 · 약물 & 물품 · 비용 (Nursing & Operations) - 약물 믹스 가이드 (`nursing`) 구현 완료**
  * 보톡스 및 주요 원내 약물의 오리지널 규격별 희석 권한 및 보관 매뉴얼 제공.
  * 바이알 크기(50U, 100U, 200U), 식염수 희석량(cc), 타겟 주입 용량을 넣으면 주사기 눈금(인슐린 1cc 시린지 100눈금 기준)을 환산해 주는 **실시간 약물 희석 계산기 (Dilution Calculator)** 탑재.
  * 대시보드 홈(`src/app/page.tsx`)의 간호팀 전용 카드에 믹스 가이드 라우팅 연동 및 린트 통과.
* **카테고리 3: 간호 · 약물 & 물품 · 비용 (Nursing & Operations) - 알약 식별 (`pill`) 구현 완료**
  * 낱알의 전/후면 인쇄 각인, 형태(모양), 색상, 제형 정보를 조합해 검색할 수 있는 낱알 식별 검색 패널 구축.
  * 서버리스 환경에 특화된 식약처 오픈 API 프록시 라우터(`src/app/api/pill/route.ts`) 구현 및 로컬 개발용 오프라인 Fallback Mock DB 연동.
  * 대시보드 홈(`src/app/page.tsx`)에 알약 식별 검색 바로 가기 카드 연동 및 린트 패스.
* **카테고리 3: 간호 · 약물 & 물품 · 비용 (Nursing & Operations) - 간호 재고 현황 (`nursing_stock`) 구현 완료**
  * 원내 약품(보톡스, 필러, 스킨부스터, 생리식염수 등) 품목 등록 및 실시간 재고 대조용 현황판 구축.
  * **안전 임계치 기반 재고 부족 경고 시스템(Low Stock Alert)** 탑재.
  * 담당자 기반의 실시간 입출고 트랜잭션 기록 및 최근 10개 입출고 히스토리 로그 위젯 연동.
  * `localStorage` 연계 영속화 처리 및 대시보드 홈 홈(`src/app/page.tsx`) 간호 전용 카드 듀얼 연결 완료.

---

* **카테고리 3: 간호 · 약물 & 물품 · 비용 (Nursing & Operations) - 소모품 단가표 (`products`) 연동 완료**
  * 대시보드 홈(`/`)과 `/products` 페이지 간 라우팅 연동 완료.
* **카테고리 4: 직원 관리 (HR Management) 구현 완료**
  * **수건개기 당번 (`duty-towel`)**: 주간 로테이션 일정 및 팀 정보 조회/수정 기능 구현.
  * **의원 간 정산 현황 (`loans`)**: 지점 간 단기 자금 대여 및 주요 소모품 차입 현황 추적 장부 구현.
  * **월간 제품 판매 실적 (`sales`)**: 직원별 화장품/스킨케어 판매 리더보드 및 3D 시상대 시각화 구현.
  * **월간 근태 (`overtime`)**: 초과근무 시간 신청서 접수 및 결재 상태 관리판 구현.
* **식대 관리 (`meals`) 구현 완료**: 직원 식대 청구 및 부서별 월 누적액 관리.
* **Supabase 실시간 연동 인프라 활성화 및 환경변수 셋업 완료**
  * `.env.local` 파일에 Supabase Project URL 및 Anon API Key 정상 주입 완료.
  * 로컬 개발 서버 환경변수 캐시 제거를 위해 프로세스 재구동 완료.
* **개발자 프리패스 및 최고 관리자(Admin) 권한 가드 구현 완료**
  * `.env.local` 내 `NEXT_PUBLIC_DEV_ADMIN_EMAIL=benyny3325@gmail.com` 설정 적용.
  * `AuthContext.tsx` 내 로그인 프로필 정보 로드 시, 해당 개발자 이메일 계정이 들어오면 DB 조회 여부와 무관하게 `role: 'admin'`, `is_approved: true` 상태를 강제 주입하도록 로직 수정.
  * Next.js Middleware/Proxy 가드에서도 동일한 개발자 메일을 식별하여 가입 승인 대기실(`/pending-approval`)을 생략(Bypass)하고 어드민 메뉴 보호 제어를 통과할 수 있도록 우회 규칙 예외 적용.
* **Next.js 16 규격 변경 대응 (Middleware to Proxy 리팩토링) 완료**
  * Next.js 16(React 19)의 Deprecate 파일 규격 변경 경고(`The 'middleware' file convention is deprecated`) 해결.
  * 기존 `src/middleware.ts` 파일을 삭제하고 최신 규격인 **`src/proxy.ts`** 파일로 이전 완료.
  * 가드 핸들러 함수명을 `middleware`에서 `proxy`로 변경하여 빌드 경고 완전 제거 및 프로덕션 컴파일 무결성 검증 통과.
* **깃허브(GitHub) 한국어 이력 상세 커밋 및 푸쉬 자동화 완료**
  * 깃허브 원격 저장소(`LunaticChanel/MCOperationDashBoard`) 연동 및 브랜치 초기화(`main`) 완료.
  * 수정한 소스코드에 대한 이력을 상세하고 친절한 한국어로 명세하여 커밋 및 Push 완료.

---

## 🚀 진행 중인 작업 (Next Step)
* **구글 OAuth 연동 설정 가이드 및 배포 사이트 주소 연결**
  * 구글 클라우드 콘솔 발급 키의 Supabase Provider 바인딩 작업 지원.
  * Vercel 배포 주소(Site URL 및 Redirect URLs)의 Supabase URL Configuration 화이트리스트 등록 상태 모니터링.
