'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/auth/RoleGuard';

export default function Home() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Navigation Bar */}
      <header className="border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-400 to-blue-200 font-serif">
              Medical Glow
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Operations 2026
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-neutral-200">{profile?.name || '직원'}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{profile?.role}팀</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-all text-xs font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Welcome Section */}
        <section className="p-8 bg-neutral-950 border border-neutral-900 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              안녕하세요, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">{profile?.name || '직원'}</span> 님.
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
              원내 인트라넷 및 대시보드에 오신 것을 환영합니다. 현재 승인 상태는 <span className="text-emerald-400 font-semibold">승인 완료</span>이며,
              부여된 역할 권한은 <span className="text-cyan-400 font-semibold uppercase">{profile?.role}</span>입니다.
            </p>
          </div>
        </section>

        {/* Dynamic Cards Layout based on Roles */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold tracking-wider text-neutral-300 uppercase">내 사용 가능 도구</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 누구나 접근 가능한 기본 카드: 주간 회의록 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">주간 회의록</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                원내 주요 안건, 공지사항 및 결정 사항 기록·조회 도구.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/meeting-minutes')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  회의록 열기
                </button>
              </div>
            </div>

            {/* 누구나 접근 가능한 기본 카드 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">외국인 상담 통역기</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                홍콩/대만 번체中文 + 병음 지원 통역 도구. iPad 최적화.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/interpreter')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  통역기 열기
                </button>
              </div>
            </div>

            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">REVIV 수가표</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                리프팅, 색소, 보톡스, 필러 등 전체 시술 가격 목록 조회.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/menu')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  수가 조회
                </button>
              </div>
            </div>

            {/* 누구나 접근 가능한 기본 카드: AI 상태 + 일정 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">AI 상태 + 일정</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                원내 AI 에이전트들의 실시간 모니터링 상태 뷰 및 크론 스케줄러 현황판.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/calendar')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  상태 뷰어 열기
                </button>
              </div>
            </div>

            {/* 누구나 접근 가능한 기본 카드: 시즌 및 게릴라 이벤트 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">시즌 및 게릴라 이벤트</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                개원 1주년 특별 할인 패키지 및 대표원장 생일 게릴라 특가 현황.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/events')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  이벤트 판 열기
                </button>
              </div>
            </div>

            {/* 누구나 접근 가능한 기본 카드: 알약 식별 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">알약 식별 검색</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                식약처 API 기반으로 낱알 조건 검색 (각인, 모양, 색상, 제형 조건 필터).
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/pill')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  식별 검색 열기
                </button>
              </div>
            </div>

            {/* 수건 당번 로테이션 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">수건 당번 로테이션</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                데스크, 관리, 간호팀 로테이션에 기반한 주간 수건 당번 자동 배정 시스템.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/duty-towel')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  당번 일정 확인
                </button>
              </div>
            </div>

            {/* 식대 정산 관리 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">식대 청구 및 정산</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                직원 식대(1일 최대 1.5만원) 신청 및 부서별 월간 식대 누적 현황 조회.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/meals')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  식대 장부 열기
                </button>
              </div>
            </div>

            {/* 월간 근태 & OT */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">월간 근태 & OT</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                연장근무(OT) 시간 초과 청구서 제출 및 월간 근태 결재 모니터링.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/overtime')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  근태 현황 열기
                </button>
              </div>
            </div>

            {/* 제품 판매 실적 */}
            <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">공통</span>
              <h4 className="text-lg font-bold text-white">제품 판매 실적 리더보드</h4>
              <p className="text-neutral-400 text-xs leading-normal">
                직원별 화장품 및 스킨케어 제품 누적 판매 순위 및 3D 시상대 MVP 현황.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => router.push('/sales')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  리더보드 보기
                </button>
              </div>
            </div>

            {/* 간호팀 전용 카드 */}
            <RoleGuard allowedRoles={['admin', 'nurse']}>
              <div className="p-6 bg-neutral-950 border border-cyan-500/10 rounded-2xl space-y-3 relative overflow-hidden group hover:border-cyan-500/20 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
                <span className="text-xs font-semibold text-cyan-500/70 uppercase tracking-widest">간호팀 전용</span>
                <h4 className="text-lg font-bold text-white">약물 믹스 가이드 및 재고</h4>
                <p className="text-neutral-400 text-xs leading-normal">
                  보톡스 믹스법 가이드 및 월별 약물 입출고 재고 추적 관리.
                </p>
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => router.push('/nursing')}
                    className="flex-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors text-center"
                  >
                    믹스 가이드
                  </button>
                  <button 
                    onClick={() => router.push('/nursing-stock')}
                    className="flex-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors text-center"
                  >
                    재고 현황판
                  </button>
                </div>
              </div>
            </RoleGuard>

            {/* 소모품 단가표 카드 */}
            <RoleGuard allowedRoles={['admin', 'nurse']}>
              <div className="p-6 bg-neutral-950 border border-cyan-500/10 rounded-2xl space-y-3 relative overflow-hidden group hover:border-cyan-500/20 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
                <span className="text-xs font-semibold text-cyan-500/70 uppercase tracking-widest">간호팀 전용</span>
                <h4 className="text-lg font-bold text-white">소모품 단가 정리표</h4>
                <p className="text-neutral-400 text-xs leading-normal">
                  원내에서 사용하는 주사기, 위생품 등의 구매 정보 및 박스/개당 단가표.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => router.push('/products')}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors text-center w-full"
                  >
                    단가표 보기
                  </button>
                </div>
              </div>
            </RoleGuard>

            {/* 데스크/관리자 카드 */}
            <RoleGuard allowedRoles={['admin', 'desk']}>
              <div className="p-6 bg-neutral-950 border border-cyan-500/10 rounded-2xl space-y-3 relative overflow-hidden group hover:border-cyan-500/20 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
                <span className="text-xs font-semibold text-cyan-500/70 uppercase tracking-widest">데스크 / 원장</span>
                <h4 className="text-lg font-bold text-white">의원 간 정산 현황</h4>
                <p className="text-neutral-400 text-xs leading-normal">
                  대여금 및 의원 채권/채무 정산 현황 모니터링 보드.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => router.push('/loans')}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors"
                  >
                    정산 현황 조회
                  </button>
                </div>
              </div>
            </RoleGuard>

            {/* 마케팅/관리자 카드 */}
            <RoleGuard allowedRoles={['admin', 'marketing']}>
              <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">마케팅 / 원장</span>
                <h4 className="text-lg font-bold text-white">글로벌 마케팅 & 링크트리</h4>
                <p className="text-neutral-400 text-xs leading-normal">
                  SNS 연동 관리 및 다국어(영, 중, 일) 수가표 링크 관리.
                </p>
                <div className="pt-2">
                  <button className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors">
                    마케팅 보드 열기
                  </button>
                </div>
              </div>
            </RoleGuard>

            {/* 최고 관리자(Admin) 전용: 신규 직원 승인 권한 */}
            <RoleGuard allowedRoles={['admin']}>
              <div className="p-6 bg-neutral-950 border border-cyan-500/30 rounded-2xl space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-xl rounded-full"></div>
                <span className="text-xs font-semibold text-cyan-500 uppercase tracking-widest">최고 관리자 전용</span>
                <h4 className="text-lg font-bold text-cyan-400">직원 권한 승인 및 RBAC 관리</h4>
                <p className="text-neutral-400 text-xs leading-normal">
                  구글로 신규 가입한 직원의 승인 및 부서 역할 배정.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => router.push('/admin/approvals')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-500/10"
                  >
                    직원 승인 관리
                  </button>
                </div>
              </div>
            </RoleGuard>

          </div>
        </section>
      </main>
    </div>
  );
}
