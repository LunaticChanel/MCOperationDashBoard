'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface LoanTransaction {
  id: string;
  date: string;
  borrower: string; // 빌린 곳 (지점)
  lender: string;   // 빌려준 곳 (지점)
  type: 'cash' | 'item';
  amountOrItem: string; // 금액 또는 물품명+수량
  valueEstimate: number; // 환산 금액 (원)
  status: 'pending' | 'resolved';
  resolvedDate?: string;
  note: string;
}

const DEFAULT_LOANS: LoanTransaction[] = [
  {
    id: 'loan-1',
    date: '2026-06-02',
    borrower: '강남점',
    lender: '본점 (Medical Glow)',
    type: 'cash',
    amountOrItem: '5,000,000원',
    valueEstimate: 5000000,
    status: 'pending',
    note: '강남점 광고 집행 비용 단기 대여'
  },
  {
    id: 'loan-2',
    date: '2026-06-05',
    borrower: '신촌점',
    lender: '본점 (Medical Glow)',
    type: 'item',
    amountOrItem: '울쎄라 트랜스듀서 팁 3.0mm (2개)',
    valueEstimate: 2400000,
    status: 'pending',
    note: '재고 부족으로 인한 본사 긴급 대여'
  },
  {
    id: 'loan-3',
    date: '2026-06-08',
    borrower: '본점 (Medical Glow)',
    lender: '홍대점',
    type: 'item',
    amountOrItem: '보톡스 (보툴렉스 100U) 20바이알',
    valueEstimate: 600000,
    status: 'resolved',
    resolvedDate: '2026-06-12',
    note: '주말 물품 부족 지원 요청건 (현물 상환 완료)'
  },
  {
    id: 'loan-4',
    date: '2026-06-11',
    borrower: '명동점',
    lender: '본점 (Medical Glow)',
    type: 'item',
    amountOrItem: 'BD 인슐린 주사기 5박스',
    valueEstimate: 140000,
    status: 'pending',
    note: '수입 지연으로 인한 긴급 차용'
  }
];

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanTransaction[]>([]);
  
  // New transaction form state
  const [borrower, setBorrower] = useState('');
  const [lender, setLender] = useState('');
  const [type, setType] = useState<'cash' | 'item'>('cash');
  const [amountOrItem, setAmountOrItem] = useState('');
  const [valueEstimate, setValueEstimate] = useState<number>(0);
  const [note, setNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('glow_loans_data');
    let initialLoans = DEFAULT_LOANS;
    if (saved) {
      try {
        initialLoans = JSON.parse(saved);
      } catch {
        initialLoans = DEFAULT_LOANS;
      }
    }
    Promise.resolve().then(() => {
      setLoans(initialLoans);
    });
  }, []);

  const saveLoans = (newLoans: LoanTransaction[]) => {
    setLoans(newLoans);
    localStorage.setItem('glow_loans_data', JSON.stringify(newLoans));
  };

  // Summary counts
  const summary = useMemo(() => {
    let receivable = 0; // 본점이 빌려준 것 (받아야 할 돈)
    let payable = 0;    // 본점이 빌린 것 (갚아야 할 돈)

    loans.forEach(loan => {
      if (loan.status === 'resolved') return;
      
      // 본점을 기준으로 계산
      const isLenderMain = loan.lender.includes('본점');
      const isBorrowerMain = loan.borrower.includes('본점');

      if (isLenderMain) {
        receivable += loan.valueEstimate;
      } else if (isBorrowerMain) {
        payable += loan.valueEstimate;
      }
    });

    return { receivable, payable };
  }, [loans]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrower || !lender || !amountOrItem || valueEstimate <= 0) {
      alert('모든 필수 정보를 올바르게 입력해주세요.');
      return;
    }

    const newTx: LoanTransaction = {
      id: `loan-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      borrower,
      lender,
      type,
      amountOrItem,
      valueEstimate,
      status: 'pending',
      note
    };

    saveLoans([newTx, ...loans]);
    
    // Reset form
    setBorrower('');
    setLender('');
    setType('cash');
    setAmountOrItem('');
    setValueEstimate(0);
    setNote('');
    setShowAddForm(false);
  };

  const handleResolve = (id: string) => {
    if (!window.confirm('해당 정산 건을 상환 완료(해결) 처리하시겠습니까?')) return;
    const updated = loans.map(loan => {
      if (loan.id === id) {
        return {
          ...loan,
          status: 'resolved' as const,
          resolvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return loan;
    });
    saveLoans(updated);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('정말로 이 내역을 삭제하시겠습니까?')) return;
    const updated = loans.filter(loan => loan.id !== id);
    saveLoans(updated);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
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
              의원 간 정산 현황
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">의원 간 정산 관리</h2>
            <p className="text-neutral-400 text-sm">지점(의원) 간 단기 자금 대여 및 주요 소모품/레이저 팁 차용 거래 장부입니다.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all"
          >
            {showAddForm ? '입력창 닫기' : '신규 정산 기록 추가'}
          </button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-950 border border-cyan-500/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold block">본점 기준 회수 대상 (총 채권)</span>
            <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">
              {formatPrice(summary.receivable)}
            </h3>
            <p className="text-neutral-500 text-[11px] mt-1">타 지점에 빌려준 뒤 아직 돌려받지 못한 잔액</p>
          </div>

          <div className="p-6 bg-neutral-950 border border-red-500/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-xl rounded-full"></div>
            <span className="text-[10px] uppercase tracking-wider text-red-400 font-semibold block">본점 기준 상환 대상 (총 채무)</span>
            <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">
              {formatPrice(summary.payable)}
            </h3>
            <p className="text-neutral-500 text-[11px] mt-1">타 지점으로부터 빌린 뒤 아직 갚지 않은 잔액</p>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddTransaction} className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-cyan-400">신규 거래내역 등록</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">빌려준 지점 (Lender) *</label>
                <input
                  type="text"
                  placeholder="예: 본점 (Medical Glow)"
                  value={lender}
                  onChange={(e) => setLender(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">빌려간 지점 (Borrower) *</label>
                <input
                  type="text"
                  placeholder="예: 강남점"
                  value={borrower}
                  onChange={(e) => setBorrower(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">거래 분류 *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'cash' | 'item')}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                >
                  <option value="cash">자금 대여 (원화)</option>
                  <option value="item">소모품 / 자재 차용</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">상세 내용 (수량/금액) *</label>
                <input
                  type="text"
                  placeholder="예: 3,000,000원 또는 필러 10개"
                  value={amountOrItem}
                  onChange={(e) => setAmountOrItem(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">원화 환산 가치 (원화) *</label>
                <input
                  type="number"
                  placeholder="예: 3000000"
                  value={valueEstimate || ''}
                  onChange={(e) => setValueEstimate(Number(e.target.value))}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-semibold">특이사항 (용도 등)</label>
                <input
                  type="text"
                  placeholder="상세 내용을 적어주세요."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-lg hover:text-white"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-cyan-500 text-black font-bold text-xs rounded-lg hover:bg-cyan-400"
              >
                등록하기
              </button>
            </div>
          </form>
        )}

        {/* Transactions list */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-300">정산 원장 세부 내역</h3>

          <div className="border border-neutral-900 rounded-3xl overflow-hidden bg-neutral-950">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/80 text-neutral-400">
                    <th className="p-4 font-semibold">날짜</th>
                    <th className="p-4 font-semibold">빌려준 곳 (Lender)</th>
                    <th className="p-4 font-semibold">빌려간 곳 (Borrower)</th>
                    <th className="p-4 font-semibold">유형</th>
                    <th className="p-4 font-semibold">수량 / 내용</th>
                    <th className="p-4 font-semibold">원화 환산가</th>
                    <th className="p-4 font-semibold">상태</th>
                    <th className="p-4 font-semibold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-neutral-500">
                        기록된 의원 간 정산 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    loans.map(loan => (
                      <tr 
                        key={loan.id}
                        className={`hover:bg-neutral-900/10 transition-colors ${
                          loan.status === 'resolved' ? 'opacity-50' : ''
                        }`}
                      >
                        <td className="p-4 text-neutral-400 font-mono">{loan.date}</td>
                        <td className="p-4 font-semibold text-white">{loan.lender}</td>
                        <td className="p-4 font-semibold text-white">{loan.borrower}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            loan.type === 'cash' 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                              : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          }`}>
                            {loan.type === 'cash' ? '자금' : '물품'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-neutral-200 font-semibold">{loan.amountOrItem}</div>
                            {loan.note && <div className="text-[10px] text-neutral-500 mt-0.5">{loan.note}</div>}
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-neutral-300">
                          {formatPrice(loan.valueEstimate)}
                        </td>
                        <td className="p-4">
                          {loan.status === 'resolved' ? (
                            <span className="text-[10px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                              상환 완료 ({loan.resolvedDate})
                            </span>
                          ) : (
                            <span className="text-[10px] text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20 font-semibold">
                              상환 대기 중
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {loan.status === 'pending' && (
                            <button
                              onClick={() => handleResolve(loan.id)}
                              className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[10px] rounded transition-all"
                            >
                              상환 완료
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(loan.id)}
                            className="px-2 py-1 bg-neutral-900 hover:bg-red-500/20 hover:text-red-400 border border-neutral-800 text-neutral-400 text-[10px] rounded transition-all"
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
