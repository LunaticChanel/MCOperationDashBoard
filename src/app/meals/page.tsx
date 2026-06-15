'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface MealRecord {
  id: string;
  employeeName: string;
  department: 'desk' | 'nurse' | 'aesthetic' | 'admin';
  date: string;
  amount: number; // 식대 사용액
  menu: string;   // 식사한 메뉴
  type: 'lunch' | 'dinner';
}

const DEFAULT_MEALS: MealRecord[] = [
  { id: 'm-1', employeeName: '김지은', department: 'desk', date: '2026-06-15', amount: 9500, menu: '김치찌개 백반', type: 'lunch' },
  { id: 'm-2', employeeName: '이지아', department: 'aesthetic', date: '2026-06-15', amount: 12000, menu: '초밥 정식', type: 'lunch' },
  { id: 'm-3', employeeName: '박서연', department: 'nurse', date: '2026-06-15', amount: 8000, menu: '짜장면', type: 'lunch' },
  { id: 'm-4', employeeName: '최민우', department: 'aesthetic', date: '2026-06-15', amount: 10000, menu: '돈까스', type: 'lunch' },
  { id: 'm-5', employeeName: '한소희', department: 'aesthetic', date: '2026-06-12', amount: 15000, menu: '스테이크 덮밥 (연장근무 식대)', type: 'dinner' }
];

export default function MealsPage() {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  
  // Apply Form State
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState<'desk' | 'nurse' | 'aesthetic' | 'admin'>('desk');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [menu, setMenu] = useState('');
  const [type, setType] = useState<'lunch' | 'dinner'>('lunch');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('glow_meal_records');
    let initialMeals = DEFAULT_MEALS;
    if (saved) {
      try {
        initialMeals = JSON.parse(saved);
      } catch {
        initialMeals = DEFAULT_MEALS;
      }
    }
    Promise.resolve().then(() => {
      setMeals(initialMeals);
    });
  }, []);

  const saveMeals = (newMeals: MealRecord[]) => {
    setMeals(newMeals);
    localStorage.setItem('glow_meal_records', JSON.stringify(newMeals));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !date || amount <= 0 || !menu) {
      alert('필수 입력 항목을 올바르게 채워주세요.');
      return;
    }

    const newRecord: MealRecord = {
      id: `meal-${Date.now()}`,
      employeeName,
      department,
      date,
      amount,
      menu,
      type
    };

    saveMeals([newRecord, ...meals]);
    
    // Reset Form
    setEmployeeName('');
    setDate('');
    setAmount(0);
    setMenu('');
    setType('lunch');
    setShowApplyForm(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const updated = meals.filter(rec => rec.id !== id);
    saveMeals(updated);
  };

  // Analytics
  const analytics = useMemo(() => {
    let totalSpent = 0;
    const departmentSpent: Record<string, number> = {
      desk: 0,
      nurse: 0,
      aesthetic: 0,
      admin: 0
    };

    meals.forEach(rec => {
      totalSpent += rec.amount;
      departmentSpent[rec.department] = (departmentSpent[rec.department] || 0) + rec.amount;
    });

    return { totalSpent, departmentSpent };
  }, [meals]);

  const getDeptName = (dept: string) => {
    switch (dept) {
      case 'desk': return '데스크팀';
      case 'nurse': return '간호팀';
      case 'aesthetic': return '피부관리팀';
      case 'admin': return '행정/관리팀';
      default: return dept;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const handleReset = () => {
    if (window.confirm('기본 식대 장부 데이터로 초기화하시겠습니까?')) {
      saveMeals(DEFAULT_MEALS);
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
              식대 정산 관리
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
            <h2 className="text-2xl font-extrabold tracking-tight text-white">직원 식대 정산 대시보드</h2>
            <p className="text-neutral-400 text-sm">부서원들의 매일 점심 및 연장근무 시 야간 식사 청구 장부입니다. (개인별 1일 청구 제한 15,000원)</p>
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
              {showApplyForm ? '작성창 닫기' : '식대 청구서 작성'}
            </button>
          </div>
        </div>

        {/* Meal Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">이번 달 누적 청구액</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-cyan-400">{formatPrice(analytics.totalSpent)}</span>
            </div>
            <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-500 h-full rounded-full transition-all" 
                style={{ width: `${Math.min((analytics.totalSpent / 1500000) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-[9px] text-neutral-500 block">원내 월 식대 예산(1,500,000원) 대비 실청구액</span>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">평균 식사 비용</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {meals.length > 0 ? formatPrice(Math.round(analytics.totalSpent / meals.length)) : '₩0'}
              </span>
            </div>
            <span className="text-[9px] text-neutral-500 block">건당 결제액 기준 평균가</span>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-3">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">부서별 식대 합계</span>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span>피부관리팀:</span> 
                <span className="text-neutral-300 font-bold">{formatPrice(analytics.departmentSpent.aesthetic || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>데스크팀:</span> 
                <span className="text-neutral-300 font-bold">{formatPrice(analytics.departmentSpent.desk || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>간호팀:</span> 
                <span className="text-neutral-300 font-bold">{formatPrice(analytics.departmentSpent.nurse || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Form */}
        {showApplyForm && (
          <form onSubmit={handleApply} className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4 max-w-xl">
            <h3 className="text-xs font-bold text-cyan-400">식대 신청서 작성</h3>
            
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
                <label className="text-[10px] text-neutral-400 block font-semibold">식사 일자 *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">청구 금액 (원화) *</label>
                <input
                  type="number"
                  placeholder="예: 9500 (최대 15000원)"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  max="15000"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">구분 *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'lunch' | 'dinner')}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                >
                  <option value="lunch">점심 식사</option>
                  <option value="dinner">야간 연장 근무 식사</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">식사 메뉴명 *</label>
                <input
                  type="text"
                  placeholder="예: 백반, 돈까스 등"
                  value={menu}
                  onChange={(e) => setMenu(e.target.value)}
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
                청구 등록
              </button>
            </div>
          </form>
        )}

        {/* Meals List Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-300">식대 정산 영수 리스트</h3>

          <div className="border border-neutral-900 rounded-3xl overflow-hidden bg-neutral-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/80 text-neutral-400">
                    <th className="p-4 font-semibold">식사일</th>
                    <th className="p-4 font-semibold">이름</th>
                    <th className="p-4 font-semibold">부서</th>
                    <th className="p-4 font-semibold">구분</th>
                    <th className="p-4 font-semibold">메뉴</th>
                    <th className="p-4 font-semibold text-right">청구액</th>
                    <th className="p-4 font-semibold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {meals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-neutral-500">
                        기록된 식대 사용 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    meals.map(rec => (
                      <tr 
                        key={rec.id}
                        className="hover:bg-neutral-900/10 transition-colors"
                      >
                        <td className="p-4 font-mono text-neutral-400">{rec.date}</td>
                        <td className="p-4 font-bold text-white">{rec.employeeName}</td>
                        <td className="p-4 text-neutral-400">{getDeptName(rec.department)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            rec.type === 'lunch'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}>
                            {rec.type === 'lunch' ? '점심' : '야근석식'}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300">{rec.menu}</td>
                        <td className="p-4 text-right font-bold font-mono text-cyan-400">{formatPrice(rec.amount)}</td>
                        <td className="p-4 text-right">
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
