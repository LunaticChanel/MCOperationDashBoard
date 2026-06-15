'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface TowelDuty {
  weekStarting: string; // YYYY-MM-DD
  team: 'desk' | 'nurse' | 'admin';
  note: string;
}

const DEFAULT_DUTIES: TowelDuty[] = [
  { weekStarting: '2026-06-01', team: 'desk', note: '6월 첫째 주 정상 배정' },
  { weekStarting: '2026-06-08', team: 'nurse', note: '6월 둘째 주 정상 배정' },
  { weekStarting: '2026-06-15', team: 'admin', note: '현재 주간 - 관리/행정팀 차례' },
  { weekStarting: '2026-06-22', team: 'desk', note: '6월 넷째 주 예정' },
  { weekStarting: '2026-06-29', team: 'nurse', note: '6월 다섯째 주 예정' },
  { weekStarting: '2026-07-06', team: 'admin', note: '7월 첫째 주 예정' },
];

export default function TowelDutyPage() {
  const [duties, setDuties] = useState<TowelDuty[]>([]);
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [editTeam, setEditTeam] = useState<'desk' | 'nurse' | 'admin'>('desk');
  const [editNote, setEditNote] = useState('');

  // Hydration safety
  useEffect(() => {
    const saved = localStorage.getItem('glow_towel_duties');
    let initialDuties = DEFAULT_DUTIES;
    if (saved) {
      try {
        initialDuties = JSON.parse(saved);
      } catch {
        initialDuties = DEFAULT_DUTIES;
      }
    }
    Promise.resolve().then(() => {
      setDuties(initialDuties);
    });
  }, []);

  const saveDuties = (newDuties: TowelDuty[]) => {
    setDuties(newDuties);
    localStorage.setItem('glow_towel_duties', JSON.stringify(newDuties));
  };

  const handleEditStart = (duty: TowelDuty) => {
    setEditingWeek(duty.weekStarting);
    setEditTeam(duty.team);
    setEditNote(duty.note);
  };

  const handleEditSave = () => {
    if (!editingWeek) return;
    const updated = duties.map(d => {
      if (d.weekStarting === editingWeek) {
        return { ...d, team: editTeam, note: editNote };
      }
      return d;
    });
    saveDuties(updated);
    setEditingWeek(null);
  };

  const handleReset = () => {
    if (window.confirm('기본 당번 로테이션 일정으로 초기화하시겠습니까?')) {
      saveDuties(DEFAULT_DUTIES);
    }
  };

  const getTeamBadgeColor = (team: string) => {
    switch (team) {
      case 'desk':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'nurse':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  const getTeamName = (team: string) => {
    switch (team) {
      case 'desk':
        return '데스크팀 (Desk)';
      case 'nurse':
        return '간호팀 (Nursing)';
      case 'admin':
        return '관리/원장단 (Admin)';
      default:
        return team;
    }
  };

  // Find current week's duty (closest to 2026-06-15)
  const currentWeekDuty = useMemo(() => {
    return duties.find(d => d.weekStarting === '2026-06-15') || duties[2];
  }, [duties]);

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
              수건 당번 로테이션
            </span>
          </div>
          <Link
            href="/"
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
          >
            대시보드 홈
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-10">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">수건개기 당번 로테이션</h2>
            <p className="text-neutral-400 text-sm">원내 타올 청결 유지를 위해 데스크팀, 간호팀, 관리팀이 주간 단위로 교대 배정됩니다.</p>
          </div>
          <button
            onClick={handleReset}
            className="text-xs bg-neutral-950 border border-neutral-900 hover:border-red-500/20 hover:text-red-400 px-3.5 py-1.5 rounded-lg transition-all"
          >
            일정 초기화
          </button>
        </div>

        {/* Highlight Card: Current Week */}
        {currentWeekDuty && (
          <div className="p-8 bg-neutral-950 border border-cyan-500/20 rounded-3xl relative overflow-hidden shadow-2xl shadow-cyan-500/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-950/50 border border-cyan-500/20 px-3 py-1 rounded-full">
                  이번 주 당번 (Active)
                </span>
                <span className="text-xs text-neutral-500 font-mono">시작일: {currentWeekDuty.weekStarting}</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white leading-tight">
                  {getTeamName(currentWeekDuty.team)}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {currentWeekDuty.note || '특이사항이 없습니다.'}
                </p>
              </div>

              <div className="pt-2 text-xs text-neutral-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                매주 월요일 당번 팀이 교체되며, 누락 및 미비 사항 발생 시 서로 격려하여 채워주시기 바랍니다.
              </div>
            </div>
          </div>
        )}

        {/* Duty Schedule Table / List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-300">주간 로테이션 일정표</h3>
          
          <div className="border border-neutral-900 rounded-2xl overflow-hidden bg-neutral-950">
            <div className="divide-y divide-neutral-900">
              {duties.map((duty) => (
                <div key={duty.weekStarting} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-900/30 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Date badge */}
                    <div className="text-left">
                      <span className="text-xs font-semibold text-neutral-400 font-mono block">
                        {duty.weekStarting}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">월요일 시작</span>
                    </div>
                    
                    {/* Arrow/Line icon */}
                    <div className="h-6 w-[1px] bg-neutral-800 hidden sm:block"></div>

                    {/* Team Badge */}
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getTeamBadgeColor(duty.team)}`}>
                      {getTeamName(duty.team)}
                    </span>
                  </div>

                  {/* Notes / Edit action */}
                  <div className="flex-1 sm:pl-4 text-left">
                    <p className="text-xs text-neutral-400 font-light truncate max-w-sm sm:max-w-md">
                      {duty.note || '특이사항 없음'}
                    </p>
                  </div>

                  <div>
                    {editingWeek === duty.weekStarting ? (
                      <div className="flex flex-col gap-2 bg-neutral-900 p-4 rounded-xl border border-neutral-800 w-full sm:w-80">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">당번 수정: {duty.weekStarting}</span>
                        <select
                          value={editTeam}
                          onChange={(e) => setEditTeam(e.target.value as 'desk' | 'nurse' | 'admin')}
                          className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="desk">데스크팀</option>
                          <option value="nurse">간호팀</option>
                          <option value="admin">관리/원장단</option>
                        </select>
                        <input
                          type="text"
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="특이사항 입력"
                          className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingWeek(null)}
                            className="px-2.5 py-1 bg-neutral-800 text-neutral-400 text-xs rounded hover:bg-neutral-700"
                          >
                            취소
                          </button>
                          <button
                            onClick={handleEditSave}
                            className="px-2.5 py-1 bg-cyan-500 text-black font-bold text-xs rounded hover:bg-cyan-400"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditStart(duty)}
                        className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[11px] rounded-lg transition-colors"
                      >
                        수정
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
