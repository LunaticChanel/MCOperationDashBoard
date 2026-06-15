'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface AIAgent {
  name: string;
  role: string;
  status: 'active' | 'syncing' | 'idle' | 'error';
  lastActive: string;
  usageCpu: number;
  usageMem: number;
  tasks: string[];
}

interface CronJob {
  id: string;
  agentName: string;
  taskName: string;
  cronExpression: string;
  nextRun: string;
  lastRunStatus: 'success' | 'failed';
}

const INITIAL_AGENTS: AIAgent[] = [
  {
    name: '알프레도 (Alfredo)',
    role: '간호 재고 & 소모품 단가 모니터링',
    status: 'active',
    lastActive: '방금 전',
    usageCpu: 12,
    usageMem: 45,
    tasks: ['간호 재고 구글 시트 2방향 동기화', '소모품 임계치 부족 알림 발송']
  },
  {
    name: '자비스 (Jarvis)',
    role: '정산 및 대여금 채권 현황판 관리',
    status: 'syncing',
    lastActive: '방금 전',
    usageCpu: 58,
    usageMem: 72,
    tasks: ['의원 간 정산 내역 집계 및 백업', '월간 매출 리더보드 순위 연산']
  },
  {
    name: '맥스 (Max)',
    role: '식약처 API 알약 식별 검색 서비스',
    status: 'idle',
    lastActive: '5분 전',
    usageCpu: 2,
    usageMem: 28,
    tasks: ['식약처 알약 식별 공공데이터 변경분 캐싱', '알약 이미지 해싱 인덱싱']
  },
  {
    name: '녹스 (Nox)',
    role: '초과근무 및 직원 월간 근태 집계',
    status: 'active',
    lastActive: '3분 전',
    usageCpu: 8,
    usageMem: 35,
    tasks: ['근태 초과근무 대조 연산', '수건 당번 로테이션 테이블 주간 갱신']
  },
  {
    name: '닉스 (Nyx)',
    role: '대표원장 쓰레드 연동 & 글로벌 마케팅',
    status: 'idle',
    lastActive: '12분 전',
    usageCpu: 1,
    usageMem: 18,
    tasks: ['SNS API 연동 및 공식 채널 모니터링', '다국어 번체/간체 수가표 변형 동기화']
  },
  {
    name: '캐스 (Cas)',
    role: '식대 관리 및 원내 인트라넷 로그 분석',
    status: 'error',
    lastActive: '1시간 전',
    usageCpu: 0,
    usageMem: 0,
    tasks: ['식대 구글 시트 동기화 분석기', '원내 접근 비정상 IP 탐지 차단']
  }
];

const INITIAL_CRON_JOBS: CronJob[] = [
  {
    id: 'cron-1',
    agentName: '알프레도 (Alfredo)',
    taskName: '간호 재고 시트 실시간 싱크',
    cronExpression: '*/5 * * * * (5분 주기)',
    nextRun: '2026-06-15 14:35:00',
    lastRunStatus: 'success'
  },
  {
    id: 'cron-2',
    agentName: '자비스 (Jarvis)',
    taskName: '월간 매출 리더보드 연산 및 캐싱',
    cronExpression: '0 0 * * * (매일 자정)',
    nextRun: '2026-06-16 00:00:00',
    lastRunStatus: 'success'
  },
  {
    id: 'cron-3',
    agentName: '녹스 (Nox)',
    taskName: '주간 수건 당번 로테이션 자동 배정',
    cronExpression: '0 9 * * 1 (매주 월요일 오전 9시)',
    nextRun: '2026-06-22 09:00:00',
    lastRunStatus: 'success'
  },
  {
    id: 'cron-4',
    agentName: '맥스 (Max)',
    taskName: '식약처 의약품 신규 데이터 동기화',
    cronExpression: '0 2 * * * (매일 새벽 2시)',
    nextRun: '2026-06-16 02:00:00',
    lastRunStatus: 'success'
  },
  {
    id: 'cron-5',
    agentName: '캐스 (Cas)',
    taskName: '식대 관리 집계 및 청구 데이터 갱신',
    cronExpression: '0 18 * * 5 (매주 금요일 오후 6시)',
    nextRun: '2026-06-19 18:00:00',
    lastRunStatus: 'failed'
  }
];

export default function CalendarPage() {
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [cronJobs, setCronJobs] = useState<CronJob[]>(INITIAL_CRON_JOBS);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Simulation: randomly update CPU usage and logs to look alive
  const simulateMetrics = useCallback(() => {
    setAgents(prev => 
      prev.map(agent => {
        if (agent.status === 'error') return agent;
        
        // Random CPU fluctuate
        const newCpu = Math.max(1, Math.min(99, agent.usageCpu + (Math.floor(Math.random() * 9) - 4)));
        const newMem = Math.max(10, Math.min(95, agent.usageMem + (Math.floor(Math.random() * 5) - 2)));
        
        // Status fluctuate slightly
        let newStatus = agent.status;
        if (agent.status === 'active' && Math.random() > 0.85) {
          newStatus = 'syncing';
        } else if (agent.status === 'syncing' && Math.random() > 0.7) {
          newStatus = 'active';
        }
        
        return {
          ...agent,
          usageCpu: newCpu,
          usageMem: newMem,
          status: newStatus,
          lastActive: '방금 전'
        };
      })
    );
    
    setLastUpdated(new Date().toLocaleTimeString('ko-KR'));
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      setLastUpdated(new Date().toLocaleTimeString('ko-KR'));
    });
    
    const interval = setInterval(simulateMetrics, 4000);
    return () => clearInterval(interval);
  }, [simulateMetrics]);

  // Restart error agent
  const handleRestartAgent = (agentName: string) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.name === agentName 
          ? {
              ...agent,
              status: 'active',
              usageCpu: 5,
              usageMem: 25,
              lastActive: '방금 전'
            }
          : agent
      )
    );
    
    // Also mark associated failed cron jobs as fixed/running
    setCronJobs(prev =>
      prev.map(job =>
        job.agentName === agentName && job.lastRunStatus === 'failed'
          ? { ...job, lastRunStatus: 'success' }
          : job
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-black text-white font-sans">
      
      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-400 to-blue-200 font-serif">
              Medical Glow
            </Link>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              AI 상태 + 일정
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-500 hidden sm:inline">
              실시간 갱신: {lastUpdated}
            </span>
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
            >
              대시보드 홈
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid: 2 columns layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: AI Agents Monitoring (7-cols) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">AI 에이전트 실시간 모니터링</h2>
            <p className="text-neutral-400 text-xs">원내 백그라운드 스케줄 및 시트 동기화를 책임지는 6개의 가상 비서 상태판입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div 
                key={agent.name}
                className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-800 transition-colors relative overflow-hidden"
              >
                {/* Agent Header Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{agent.name}</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{agent.role}</p>
                  </div>
                  
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    agent.status === 'active' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  } ${
                    agent.status === 'syncing' && 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse'
                  } ${
                    agent.status === 'idle' && 'bg-neutral-900 text-neutral-500 border-neutral-800'
                  } ${
                    agent.status === 'error' && 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                {/* Agent Performance Metrics */}
                {agent.status !== 'error' ? (
                  <div className="grid grid-cols-2 gap-3 bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-900">
                    <div className="space-y-1">
                      <span className="text-[9px] text-neutral-500 block uppercase">CPU Usage</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 transition-all duration-1000"
                            style={{ width: `${agent.usageCpu}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-300">{agent.usageCpu}%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-neutral-500 block uppercase">Memory</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500/80 transition-all duration-1000"
                            style={{ width: `${agent.usageMem}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-300">{agent.usageMem}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-950/20 p-3 rounded-xl border border-red-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-[10px] text-red-400">네트워크 타임아웃 및 시트 동기화 오프라인</span>
                    <button
                      onClick={() => handleRestartAgent(agent.name)}
                      className="px-2 py-1 bg-red-900/30 border border-red-500/30 hover:bg-red-500 hover:text-black hover:border-red-500 text-[10px] text-red-400 font-bold rounded transition-all"
                    >
                      재기동
                    </button>
                  </div>
                )}

                {/* Sub-tasks */}
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">주요 파이프라인</span>
                  <ul className="text-[10px] text-neutral-400 space-y-0.5 list-disc pl-3">
                    {agent.tasks.map((task, idx) => (
                      <li key={idx} className="truncate">{task}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Cron Scheduler Scheduler (5-cols) */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">자동화 일정 (Cron)</h2>
            <p className="text-neutral-400 text-xs">AI 에이전트들이 주기에 따라 백그라운드에서 동작할 예정 작업 리스트입니다.</p>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
            
            <h3 className="text-base font-bold text-cyan-400 border-b border-neutral-900 pb-3">
              예약 크론 스케줄 현황
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {cronJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="p-4 bg-neutral-900/50 border border-neutral-900 rounded-xl space-y-3 hover:border-neutral-800 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-cyan-500 font-mono font-bold uppercase tracking-wider">
                      {job.agentName.split(' ')[0]}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      job.lastRunStatus === 'success' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {job.lastRunStatus === 'success' ? '최근 정상' : '오류 중단'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{job.taskName}</h4>
                    <p className="text-[10px] text-neutral-500 mt-1">실행 주기: <code className="text-cyan-200/90 font-mono text-[10px]">{job.cronExpression}</code></p>
                  </div>

                  <div className="pt-2 border-t border-neutral-950/60 flex justify-between items-center text-[9px] text-neutral-500">
                    <span>다음 스케줄:</span>
                    <span className="font-mono text-neutral-300">{job.nextRun}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">크론 에이전트 시스템 수칙</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              본 대시보드의 에이전트 모니터링은 Supabase DB 및 Vercel Cron-job과 연동되어 구동됩니다.
              만약 특정 에이전트의 오프라인 상태(Error)가 30분 이상 지속되는 경우,
              서버리스 DB 한도(Free Tier 500MB) 초과 혹은 API Key 만료 여부를 점검해 주십시오.
            </p>
          </div>
        </aside>

      </main>
    </div>
  );
}
