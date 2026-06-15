'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface SalesRecord {
  id: string;
  employeeName: string;
  department: 'desk' | 'nurse' | 'marketing' | 'aesthetic';
  month: '06' | '07';
  salesAmount: number; // 누적 판매 금액 (원)
  count: number;       // 판매 건수
}

const DEFAULT_SALES: SalesRecord[] = [
  // 6월 데이터
  { id: 's-1', employeeName: '김지은', department: 'desk', month: '06', salesAmount: 4200000, count: 28 },
  { id: 's-2', employeeName: '이지아', department: 'aesthetic', month: '06', salesAmount: 5800000, count: 34 },
  { id: 's-3', employeeName: '박서연', department: 'nurse', month: '06', salesAmount: 3100000, count: 20 },
  { id: 's-4', employeeName: '최민우', department: 'marketing', month: '06', salesAmount: 1800000, count: 12 },
  { id: 's-5', employeeName: '한소희', department: 'aesthetic', month: '06', salesAmount: 6500000, count: 42 },
  { id: 's-6', employeeName: '정우성', department: 'desk', month: '06', salesAmount: 2200000, count: 15 },
  
  // 7월 데이터 (예정 혹은 초기 데이터)
  { id: 's-7', employeeName: '한소희', department: 'aesthetic', month: '07', salesAmount: 1200000, count: 8 },
  { id: 's-8', employeeName: '이지아', department: 'aesthetic', month: '07', salesAmount: 2100000, count: 12 },
  { id: 's-9', employeeName: '김지은', department: 'desk', month: '07', salesAmount: 950000, count: 6 },
  { id: 's-10', employeeName: '박서연', department: 'nurse', month: '07', salesAmount: 1500000, count: 10 }
];

export default function SalesPage() {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<'06' | '07'>('06');
  
  // Form state for simulating sales input
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState<'desk' | 'nurse' | 'marketing' | 'aesthetic'>('desk');
  const [salesAmount, setSalesAmount] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);

  const setDuties = (newSales: SalesRecord[]) => {
    setSales(newSales);
    localStorage.setItem('glow_sales_records', JSON.stringify(newSales));
  };

  useEffect(() => {
    const saved = localStorage.getItem('glow_sales_records');
    let initialSales = DEFAULT_SALES;
    if (saved) {
      try {
        initialSales = JSON.parse(saved);
      } catch {
        initialSales = DEFAULT_SALES;
      }
    }
    Promise.resolve().then(() => {
      setDuties(initialSales);
    });
  }, []);

  // Filter & Sort Sales by month and amount descending
  const sortedSales = useMemo(() => {
    return sales
      .filter(s => s.month === selectedMonth)
      .sort((a, b) => b.salesAmount - a.salesAmount);
  }, [sales, selectedMonth]);

  // TOP 3 Podiums
  const topThree = useMemo(() => {
    const top = sortedSales.slice(0, 3);
    // Return in order [2nd, 1st, 3rd] for podium rendering layout
    const podium = [null, null, null] as (SalesRecord | null)[];
    if (top[1]) podium[0] = top[1]; // 2등 (왼쪽)
    if (top[0]) podium[1] = top[0]; // 1등 (가운데)
    if (top[2]) podium[2] = top[2]; // 3등 (오른쪽)
    return { podium, raw: top };
  }, [sortedSales]);

  const handleAddSales = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || salesAmount <= 0 || count <= 0) {
      alert('올바른 값을 입력해주세요.');
      return;
    }

    // Check if employee record already exists for selectedMonth
    const existingIndex = sales.findIndex(
      s => s.employeeName.trim() === employeeName.trim() && s.month === selectedMonth
    );

    let updated: SalesRecord[];
    if (existingIndex > -1) {
      // 누적 합산
      updated = sales.map((s, idx) => {
        if (idx === existingIndex) {
          return {
            ...s,
            salesAmount: s.salesAmount + salesAmount,
            count: s.count + count
          };
        }
        return s;
      });
    } else {
      // 새 직원 등록
      const newRecord: SalesRecord = {
        id: `sales-${Date.now()}`,
        employeeName: employeeName.trim(),
        department,
        month: selectedMonth,
        salesAmount,
        count
      };
      updated = [newRecord, ...sales];
    }

    setDuties(updated);
    
    // Reset Form
    setEmployeeName('');
    setSalesAmount(0);
    setCount(0);
    setShowForm(false);
  };

  const getDeptName = (dept: string) => {
    switch (dept) {
      case 'desk': return '데스크팀';
      case 'nurse': return '간호팀';
      case 'marketing': return '마케팅팀';
      case 'aesthetic': return '피부관리팀';
      default: return dept;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const handleReset = () => {
    if (window.confirm('기본 판매 실적 데이터로 초기화하시겠습니까?')) {
      setDuties(DEFAULT_SALES);
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
              제품 판매 실적 리더보드
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-10">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">월간 홈케어 제품 판매 실적</h2>
            <p className="text-neutral-400 text-sm">원내 화장품, 스킨케어 등 홈케어 연계 제품 판매 및 프로모션 기여 현황입니다.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs bg-neutral-950 border border-neutral-900 hover:border-red-500/20 hover:text-red-400 px-3 py-1.5 rounded-lg transition-all"
            >
              초기화
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all"
            >
              {showForm ? '닫기' : '실적 등록'}
            </button>
          </div>
        </div>

        {/* Month Tabs */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[
              { id: '06' as const, label: '6월 실적' },
              { id: '07' as const, label: '7월 실적' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMonth(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedMonth === tab.id
                    ? 'bg-cyan-500 border-cyan-500 text-black'
                    : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <span className="text-[10px] text-neutral-500 font-mono">실시간 업데이트 반영됨</span>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleAddSales} className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4 max-w-xl">
            <h3 className="text-xs font-bold text-cyan-400">{selectedMonth}월 실적 추가 / 누적</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">직원 이름 *</label>
                <input
                  type="text"
                  placeholder="예: 이지아"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">소속 부서 *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as 'desk' | 'nurse' | 'marketing' | 'aesthetic')}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                >
                  <option value="desk">데스크팀</option>
                  <option value="nurse">간호팀</option>
                  <option value="marketing">마케팅팀</option>
                  <option value="aesthetic">피부관리팀</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">판매 금액 (원화) *</label>
                <input
                  type="number"
                  placeholder="예: 500000"
                  value={salesAmount || ''}
                  onChange={(e) => setSalesAmount(Number(e.target.value))}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">판매 건수 (건) *</label>
                <input
                  type="number"
                  placeholder="예: 3"
                  value={count || ''}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-lg hover:text-white"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-cyan-500 text-black font-bold text-xs rounded-lg hover:bg-cyan-400"
              >
                등록 / 합산
              </button>
            </div>
          </form>
        )}

        {/* 3D-Like Podium Visuals (Top 3) */}
        {sortedSales.length > 0 && (
          <div className="py-8 bg-neutral-950/40 border border-neutral-900/50 rounded-3xl flex flex-col items-center justify-center space-y-8">
            <h3 className="text-sm font-bold tracking-widest text-neutral-400 uppercase">🏆 TOP 3 리더보드 시상대 🏆</h3>
            
            <div className="flex items-end justify-center w-full max-w-lg px-6 h-60 gap-4 sm:gap-8">
              
              {/* 2nd Place */}
              {topThree.podium[0] ? (
                <div className="flex flex-col items-center w-28 sm:w-36 animate-fade-in">
                  <div className="text-center space-y-1 mb-2">
                    <span className="text-xs text-neutral-400 font-semibold block">{topThree.podium[0].employeeName}</span>
                    <span className="text-[10px] text-neutral-500 block">{getDeptName(topThree.podium[0].department)}</span>
                    <span className="text-xs text-cyan-400 font-bold font-mono">{formatPrice(topThree.podium[0].salesAmount)}</span>
                  </div>
                  <div className="w-full h-24 bg-gradient-to-t from-neutral-900 to-neutral-800 border-t border-x border-neutral-800 rounded-t-2xl flex items-center justify-center relative shadow-lg">
                    <div className="absolute top-2 right-2 text-cyan-500/10 font-bold font-serif text-5xl select-none">2</div>
                    <span className="text-xl font-black text-neutral-400 font-serif">2nd</span>
                  </div>
                </div>
              ) : (
                <div className="w-28 sm:w-36 h-24 border border-dashed border-neutral-900 rounded-t-2xl"></div>
              )}

              {/* 1st Place */}
              {topThree.podium[1] ? (
                <div className="flex flex-col items-center w-32 sm:w-40">
                  <div className="text-center space-y-1 mb-2">
                    <div className="inline-block bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest animate-pulse">👑 MVP</div>
                    <span className="text-sm text-white font-extrabold block mt-1">{topThree.podium[1].employeeName}</span>
                    <span className="text-[10px] text-neutral-400 block">{getDeptName(topThree.podium[1].department)}</span>
                    <span className="text-sm text-cyan-300 font-black font-mono">{formatPrice(topThree.podium[1].salesAmount)}</span>
                  </div>
                  <div className="w-full h-36 bg-gradient-to-t from-neutral-900 via-neutral-800 to-cyan-950/20 border-t border-x border-cyan-500/30 rounded-t-3xl flex items-center justify-center relative shadow-2xl shadow-cyan-500/5">
                    <div className="absolute top-2 right-2 text-cyan-400/20 font-bold font-serif text-6xl select-none">1</div>
                    <span className="text-2xl font-black text-cyan-400 font-serif">1st</span>
                  </div>
                </div>
              ) : (
                <div className="w-32 sm:w-40 h-36 border border-dashed border-neutral-900 rounded-t-3xl"></div>
              )}

              {/* 3rd Place */}
              {topThree.podium[2] ? (
                <div className="flex flex-col items-center w-28 sm:w-36">
                  <div className="text-center space-y-1 mb-2">
                    <span className="text-xs text-neutral-400 font-semibold block">{topThree.podium[2].employeeName}</span>
                    <span className="text-[10px] text-neutral-500 block">{getDeptName(topThree.podium[2].department)}</span>
                    <span className="text-xs text-cyan-400 font-bold font-mono">{formatPrice(topThree.podium[2].salesAmount)}</span>
                  </div>
                  <div className="w-full h-16 bg-gradient-to-t from-neutral-900 to-neutral-800 border-t border-x border-neutral-800 rounded-t-2xl flex items-center justify-center relative shadow-lg">
                    <div className="absolute top-2 right-2 text-cyan-500/10 font-bold font-serif text-4xl select-none">3</div>
                    <span className="text-lg font-black text-neutral-500 font-serif">3rd</span>
                  </div>
                </div>
              ) : (
                <div className="w-28 sm:w-36 h-16 border border-dashed border-neutral-900 rounded-t-2xl"></div>
              )}

            </div>
          </div>
        )}

        {/* Ranking List Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-300">전체 부서원 실적 순위</h3>
          
          <div className="border border-neutral-900 rounded-2xl overflow-hidden bg-neutral-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/80 text-neutral-400">
                    <th className="p-4 font-semibold w-16">순위</th>
                    <th className="p-4 font-semibold">이름</th>
                    <th className="p-4 font-semibold">부서</th>
                    <th className="p-4 font-semibold text-right">총 건수</th>
                    <th className="p-4 font-semibold text-right">총 매출액</th>
                    <th className="p-4 font-semibold text-right">평균 객단가</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {sortedSales.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-500">
                        기록된 판매 실적이 아직 없습니다.
                      </td>
                    </tr>
                  ) : (
                    sortedSales.map((item, idx) => {
                      const avgValue = item.count > 0 ? Math.round(item.salesAmount / item.count) : 0;
                      return (
                        <tr key={item.id} className="hover:bg-neutral-900/30 transition-colors">
                          <td className="p-4">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                              idx === 0 ? 'bg-yellow-500 text-black' :
                              idx === 1 ? 'bg-neutral-400 text-black' :
                              idx === 2 ? 'bg-amber-600 text-white' :
                              'bg-neutral-900 text-neutral-400 border border-neutral-800'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-white">{item.employeeName}</td>
                          <td className="p-4 text-neutral-400">{getDeptName(item.department)}</td>
                          <td className="p-4 text-right font-mono text-neutral-300">{item.count} 건</td>
                          <td className="p-4 text-right font-bold font-mono text-cyan-400">{formatPrice(item.salesAmount)}</td>
                          <td className="p-4 text-right font-mono text-neutral-400">{formatPrice(avgValue)}</td>
                        </tr>
                      );
                    })
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
