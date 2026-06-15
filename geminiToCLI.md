이 문서는 **REVIV CLINIC 운영 대시보드(Operations Dashboard 2026)** 웹 프로젝트의 지금까지의 논의 사항과 기술적 결정 스택을 총망라한 프롬프트 가이드라인입니다. 

CLI 환경이나 새로운 LLM 세션에서 이 파일의 내용을 입력하면, AI가 이전 맥락을 100% 이해하고 이어서 개발 설계, 코드 생성 및 아키텍처 고도화 작업을 진행할 수 있습니다.

---

## 1. 프로젝트 개요
* **프로젝트명:** REVIV CLINIC 운영 대시보드 (Operations Dashboard 2026)
* **목표:** 해상도, OS, 기종(모바일/태블릿/PC)에 구애받지 않고 원내 모든 직원이 사용하는 고성능·보안 중심의 종합 인트라넷 및 대시보드 구축.
* **디자인 테마:** 블랙/다크 그레이 바탕에 골드 포인트 컬러를 사용하는 세련된 카드형 반응형 UI (모바일 퍼스트 및 iPad 2컬럼 최적화).
* **운영 비용 목표:** **월 0원 (100% 서버리스 무료 티어 조합)**

---

## 2. 최종 결정 기술 스택 (Tech Stack)

| 레이어 | 채택 기술 | 채택 사유 |
| :--- | :--- | :--- |
| **프론트엔드** | **Next.js (App Router, TypeScript)** | Vercel 최적 호환, Server Components를 통한 API Key 및 DB 로직 은닉 (보안 극대화) |
| **UI 및 스타일** | **Tailwind CSS + shadcn/ui** | 유연한 반응형 다크 테마 구현 및 골드 포인트 커스텀 용이, 코드 복사 기반의 깔끔한 컴포넌트 제어 |
| **백엔드 / DB** | **Supabase (PostgreSQL 기반)** | NoSQL과 달리 전통적인 RDBMS 설계 방식 적용 가능, 무료 티어(500MB DB), 강력한 자체 인증(Auth) 제공 |
| **외부 데이터** | **Google Sheets API** | 간호 재고, 식대 등 기존 직원이 쓰던 엑셀 환경을 유지하면서 실시간 동기화로 DB 용량 절약 |
| **외부 API** | **식약처 공공데이터 API** | 알약 식별 및 검색 기능 연동 |
| **호스팅 / 배포** | **Vercel** | 무료 서버리스 함수(Serverless Functions) 제공 및 GitHub 연동을 통한 무과금 자동 배포(CI/CD) |

---

## 3. 상세 기능 명세 (대시보드 카드 기준)

### 카테고리 1: 바로 사용 (Quick Tools)
1. **주간 회의록 (`meeting_minutes`)**
   * 기능: 날짜, 안건, 결과를 직접 작성 및 기록.
   * 저장: 초기 가벼운 용도는 브라우저 `localStorage`를 활용하되 동기화 요구 시 Supabase 테이블로 확장 가능.
2. **외국인 상담 통역기 (`interpreter`)**
   * 기능: 홍콩/대만 번체中文 + 병음 지원, 간단 주소 및 직원폰 기본값 세팅. iPad 2컬럼 레이아웃 최적화.
3. **AI 상태 + 일정 (`calendar`)**
   * 기능: 원내 배치된 AI 에이전트(알프레도, 자비스, 맥스, 녹스, 닉스, 캐스)의 실시간 상태 모니터링 및 크론(Cron) 스케줄 현황 뷰어.

### 카테고리 2: 진료 · 수가 (Medical & Pricing)
1. **REVIV 수가표 (`menu.html`)**
   * 기능: 리프팅, 색소, 보톡스, 필러 등 전체 시술 가격 목록 조회.
2. **6월 이벤트 / 이벤트 2 / 게릴라 이벤트 (`june`, `june2`, `gerilla`)**
   * 기능: 개원 1주년 및 대표원장님 생일 이벤트 등 시즌별 수가/이벤트 안내 가변 페이지.

### 카테고리 3: 간호 · 약물 & 물품 · 비용 (Nursing & Operations)
1. **약물 믹스 가이드 (`nursing.html`)**
   * 기능: 보톡스 및 주요 약물 믹스법 가이드라인, 구글 시트 실시간 싱크.
2. **간호 재고 현황 (`nursing_stock`)**
   * 기능: 월별 약물 입출고 및 잔여 재고 추적 관리.
3. **알약 식별 (`pill`)**
   * 기능: 식약처 API 기반으로 낱알 검색 (앞뒤 각인, 모양, 색상, 제형 조건 필터링).
4. **소모품 단가표 (`products.html`)**
   * 기능: 원내 소모품 제품 단가 정리, 검색 및 원본 대조용 페이지.
5. **식대 관리 (`meals`)**
   * 기능: 직원 식대 집계 및 월별 현황 조회, 구글 시트 실시간 싱크.

### 카테고리 4: 직원 관리 (HR Management)
1. **수건개기 당번 (`duty_towel`)**
   * 기능: 데스크, 관리, 간호팀 로테이션에 기반한 주간 수건 당번 자동 배정 시스템.
2. **의원 간 정산 현황 (`loans`)**
   * 기능: 대여금 및 의원 간 채권/채무 정산 현황판.
3. **월간 제품 판매 실적 (`sales`)**
   * 기능: 직원별 판매 순위 리더보드, 시상대 TOP3 시각화 (6월/7월 탭 분리).
4. **월간 근태 (`overtime`)**
   * 기능: 직원 초과근무 및 월간 근태 현황판.

### 카테고리 5: 홍보 및 글로벌 마케팅 (Marketing & International)
1. **대표 쓰레드 모음 (`threads`)**
   * 기능: `@dr_reviv` 쓰레드 아카이브 (시술 정보 및 원장님 콘텐츠 연동).
2. **링크트리 (`link`)**
   * 기능: SNS, 예약, 카카오채널 등 REVIV 공식 링크 모음.
3. **다국어 수가표 시리즈**
   * `menu_zh_pinyin`: 홍콩·대만 수가표 + 병음 (Traditional Chinese + pinyin)
   * `menu_zh_cn_pinyin`: 간체 중화권 수가표 + 병음 (Simplified Chinese + pinyin)
   * `menu_en`: 영어 수가표 (English Price Book)
   * `menu_ja`: 일본어 수가표 (Japanese Price Book)

---

## 4. 핵심 아키텍처 및 보안 설계 원칙
1. **Server-Side Data Fetching:** Supabase DB 크레덴셜이나 구글 API 키는 Next.js의 `Server Components` 혹은 `App Router` 내 API Routes(`app/api/`) 단에서만 호출되어 클라이언트 브라우저 소스코드 분석 시 절대 유출되지 않도록 피막 처리함.
2. **Hybrid Data Sourcing:** 고부하/통계 데이터 및 민감 정산 데이터는 **Supabase PostgreSQL** 테이블에 인덱싱하여 엄격하게 보관하고, 간호 재고 및 식대 같은 실무자 UI 입력 접근성이 중요한 데이터는 **Google Sheets API** 래퍼를 통해 읽기/쓰기를 처리함.
3. **RBAC (Role-Based Access Control):** Supabase Auth의 JWT 토큰 정보를 파싱하여 원장, 데스크, 간호팀 등 역할군에 따라 대시보드 메뉴 진입 권한 및 쓰기 권한을 차등 부여함.

---