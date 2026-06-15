'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface OvertimeRecord {
  id: string;
  employeeName: string;
  department: 'desk' | 'nurse' | 'aesthetic' | 'admin';
  date: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DEFAULT_OVERTIMES: OvertimeRecord[] = [
  { id: 'ot-1', employeeName: '김지은', department: 'desk', date: '2026-06-12', hours: 1.5, reason: '금요일 야간진료 환자 차트 이관 및 마감 지연', status: 'approved' },
  { id: 'ot-2', employeeName: '이지아', department: 'aesthetic', date: '2026-06-12', hours: 2.0, reason: '예약 폭주로 인한 야간 관리 연장 근무', status: 'approved' },
  { id: 'ot-3', employeeName: '박서연', department: 'nurse', date: '2026-06-15', hours: 1.0, reason: '수술 장비 소독 및 약물 안전고 마감 확인', status: 'pending' },
  { id: 'ot-4', employeeName: '최민우', department: 'aesthetic', date: '2026-06-15', hours: 0.5, reason: '고객 안내 문자 및 마케팅 채널 답변 지연', status: 'pending' }
];

export default function OvertimePage() {
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  
  // Apply Form State
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState<'desk' | 'nurse' | 'aesthetic' | 'admin'>('desk');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('glow_overtime_records');
    let initialRecords = DEFAULT_OVERTIMES;
    if (saved) {
      try {
        initialRecords = JSON.parse(saved);
      } catch {
        initialRecords = DEFAULT_OVERTIMES;
      }
    }
    Promise.resolve().then(() => {
      setRecords(initialRecords);
    });
  }, []);

  const saveRecords = (newRecords: OvertimeRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('glow_overtime_records', JSON.stringify(newRecords));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !date || hours <= 0 || !reason) {
      alert('필수 입력 항목을 올바르게 채워주세요.');
      return;
    }

    const newRecord: OvertimeRecord = {
      id: `ot-${Date.now()}`,
      employeeName,
      department,
      date,
      hours,
      reason,
      status: 'pending'
    };

    saveRecords([newRecord, ...records]);
    
    // Reset Form
    setEmployeeName('');
    setDate('');
    setHours(0);
    setReason('');
    setShowApplyForm(false);
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    const updated = records.map(rec => {
      if (rec.id === id) {
        return { ...rec, status: newStatus };
      }
      return rec;
    });
    saveRecords(updated);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const updated = records.filter(rec => rec.id !== id);
    saveRecords(updated);
  };

  // Analytics
  const analytics = useMemo(() => {
    let totalApprovedHours = 0;
    let totalPendingHours = 0;
    const departmentHours: Record<string, number> = {
      desk: 0,
      nurse: 0,
      aesthetic: 0,
      admin: 0
    };

    records.forEach(rec => {
      if (rec.status === 'approved') {
        totalApprovedHours += rec.hours;
        departmentHours[rec.department] = (departmentHours[rec.department] || 0) + rec.hours;
      } else if (rec.status === 'pending') {
        totalPendingHours += rec.hours;
      }
    });

    return { totalApprovedHours, totalPendingHours, departmentHours };
  }, [records]);

  const getDeptName = (dept: string) => {
    switch (dept) {
      case 'desk': return '데스크팀';
      case 'nurse': return '간호팀';
      case 'aesthetic': return '피부관리팀';
      case 'admin': return '행정/관리팀';
      default: return dept;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '승인 완료';
      case 'rejected': return '반려됨';
      default: return '결재 대기';
    }
  };

  const handleReset = () => {
    if (window.confirm('기본 근태 기록으로 초기화하시겠습니까?')) {
      saveRecords(DEFAULT_OVERTIMES);
    }
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
              월간 근태 & OT 현황
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">연장근무(OT) 및 근태 관리</h2>
            <p className="text-neutral-400 text-sm">진료 마감, 야간 진료 연장 등으로 인한 초과근무 실적 및 결재 관리 보드입니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs bg-neutral-950 border border-neutral-900 hover:border-red-500/20 hover:text-red-400 px-3 py-1.5 rounded-lg transition-all"
            >
              기록 초기화
            </button>
            <button
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all"
            >
              {showApplyForm ? '작성창 닫기' : 'OT 초과근무 신청'}
            </button>
          </div>
        </div>

        {/* OT Overview Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">이번 달 누적 승인 시간</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-cyan-400">{analytics.totalApprovedHours}</span>
              <span className="text-sm text-neutral-500">시간</span>
            </div>
            <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-500 h-full rounded-full transition-all" 
                style={{ width: `${Math.min((analytics.totalApprovedHours / 40) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-[9px] text-neutral-500 block">원내 월 목표 OT 임계치(40시간) 대비 잔여 시간</span>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">결재 대기 중인 시간</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-yellow-500">{analytics.totalPendingHours}</span>
              <span className="text-sm text-neutral-500">시간</span>
            </div>
            <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-yellow-500 h-full rounded-full transition-all" 
                style={{ width: `${Math.min((analytics.totalPendingHours / 10) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-[9px] text-neutral-500 block">최고 관리자의 빠른 확인이 필요한 신청분</span>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">부서별 분포 (승인 기준)</span>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span>간호팀:</span> 
                <span className="text-neutral-300 font-bold">{analytics.departmentHours.nurse || 0}h</span>
              </div>
              <div className="flex justify-between">
                <span>데스크팀:</span> 
                <span className="text-neutral-300 font-bold">{analytics.departmentHours.desk || 0}h</span>
              </div>
              <div className="flex justify-between">
                <span>피부관리팀:</span> 
                <span className="text-neutral-300 font-bold">{analytics.departmentHours.aesthetic || 0}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Form */}
        {showApplyForm && (
          <form onSubmit={handleApply} className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4 max-w-xl">
            <h3 className="text-xs font-bold text-cyan-400">초과근무 신청서 작성</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">이름 *</label>
                <input
                  type="text"
                  placeholder="예: 김지은"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">부서 선택 *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as 'desk' | 'nurse' | 'aesthetic' | 'admin')}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                >
                  <option value="desk">데스크팀</option>
                  <option value="nurse">간호팀</option>
                  <option value="aesthetic">피부관리팀</option>
                  <option value="admin">행정/관리팀</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">근무 일자 *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">신청 시간 (시간 단위) *</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="예: 1.5"
                  value={hours || ''}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-neutral-400 block font-semibold">연장근무 사유 *</label>
                <input
                  type="text"
                  placeholder="예: 환자 마감 및 차트 이관 지연"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-lg hover:text-white"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-cyan-500 text-black font-bold text-xs rounded-lg hover:bg-cyan-400"
              >
                신청하기
              </button>
            </div>
          </form>
        )}

        {/* Overtimes List Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-300">신청 현황 및 결재 리스트</h3>

          <div className="border border-neutral-900 rounded-3xl overflow-hidden bg-neutral-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/80 text-neutral-400">
                    <th className="p-4 font-semibold">신청일</th>
                    <th className="p-4 font-semibold">이름</th>
                    <th className="p-4 font-semibold">부서</th>
                    <th className="p-4 font-semibold">신청 시간</th>
                    <th className="p-4 font-semibold">상세 사유</th>
                    <th className="p-4 font-semibold">결재 상태</th>
                    <th className="p-4 font-semibold text-right">관리 / 승인</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-neutral-500">
                        신청된 초과근무 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    records.map(rec => (
                      <tr 
                        key={rec.id}
                        className={`hover:bg-neutral-900/10 transition-colors ${
                          rec.status !== 'pending' ? 'opacity-70' : ''
                        }`}
                      >
                        <td className="p-4 font-mono text-neutral-400">{rec.date}</td>
                        <td className="p-4 font-bold text-white">{rec.employeeName}</td>
                        <td className="p-4 text-neutral-400">{getDeptName(rec.department)}</td>
                        <td className="p-4 font-bold font-mono text-cyan-400">{rec.hours} 시간</td>
                        <td className="p-4 text-neutral-300 max-w-xs truncate">{rec.reason}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(rec.status)}`}>
                            {getStatusText(rec.status)}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {rec.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(rec.id, 'approved')}
                                className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[10px] rounded transition-all"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleStatusChange(rec.id, 'rejected')}
                                className="px-2.5 py-1 bg-neutral-900 hover:bg-red-500/20 hover:text-red-400 border border-neutral-800 text-neutral-400 text-[10px] rounded transition-all"
                              >
                                반려
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-900 text-neutral-500 text-[10px] rounded transition-all"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
