'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface StockItem {
  id: string;
  name: string;
  category: 'botox' | 'filler' | 'skinbooster' | 'etc';
  currentStock: number;
  minThreshold: number;
  unit: string;
  updatedAt: string;
}

interface StockHistory {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  memo: string;
  operator: string;
}

const INITIAL_STOCK_ITEMS: StockItem[] = [
  { id: 'st-1', name: '보툴렉스 100U', category: 'botox', currentStock: 25, minThreshold: 10, unit: '바이알', updatedAt: '2026-06-15' },
  { id: 'st-2', name: '제오민 100U', category: 'botox', currentStock: 8, minThreshold: 10, unit: '바이알', updatedAt: '2026-06-15' }, // 경고 대상
  { id: 'st-3', name: '리쥬란 힐러 2cc', category: 'skinbooster', currentStock: 40, minThreshold: 15, unit: '시린지', updatedAt: '2026-06-15' },
  { id: 'st-4', name: '국산 HA 필러 (1cc)', category: 'filler', currentStock: 3, minThreshold: 5, unit: '시린지', updatedAt: '2026-06-15' }, // 경고 대상
  { id: 'st-5', name: '생리식염수 20ml', category: 'etc', currentStock: 120, minThreshold: 30, unit: '앰플', updatedAt: '2026-06-15' }
];

const INITIAL_HISTORY: StockHistory[] = [
  { id: 'h-1', itemId: 'st-1', itemName: '보툴렉스 100U', type: 'in', quantity: 20, date: '2026-06-14', memo: '정기 입고 물량', operator: '박간호' },
  { id: 'h-2', itemId: 'st-2', itemName: '제오민 100U', type: 'out', quantity: 2, date: '2026-06-15', memo: '3층 시술용 불출', operator: '최간호' }
];

// Impure helper outside component to satisfy react-hooks/purity lint rule
const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export default function NursingStockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'low'>('all');
  
  // Transaction Form State
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [txType, setTxType] = useState<'in' | 'out'>('out');
  const [txQty, setTxQty] = useState<number>(1);
  const [txMemo, setTxMemo] = useState('');
  const [txOperator, setTxOperator] = useState('');

  // Item Management Form State
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'botox' | 'filler' | 'skinbooster' | 'etc'>('botox');
  const [newItemThreshold, setNewItemThreshold] = useState<number>(5);
  const [newItemUnit, setNewItemUnit] = useState('바이알');
  const [newItemInitialStock, setNewItemInitialStock] = useState<number>(10);

  // Load from LocalStorage
  useEffect(() => {
    let active = true;
    
    const loadData = () => {
      try {
        const storedItems = localStorage.getItem('reviv_nursing_stock_items');
        const storedHistory = localStorage.getItem('reviv_nursing_stock_history');
        
        if (active) {
          if (storedItems) setStockItems(JSON.parse(storedItems));
          else setStockItems(INITIAL_STOCK_ITEMS);

          if (storedHistory) setHistory(JSON.parse(storedHistory));
          else setHistory(INITIAL_HISTORY);
        }
      } catch (error) {
        console.error('Failed to load stock data:', error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    Promise.resolve().then(loadData);

    return () => {
      active = false;
    };
  }, []);

  // Sync / Save Helpers
  const syncData = useCallback((items: StockItem[], hist: StockHistory[]) => {
    try {
      localStorage.setItem('reviv_nursing_stock_items', JSON.stringify(items));
      localStorage.setItem('reviv_nursing_stock_history', JSON.stringify(hist));
      setStockItems(items);
      setHistory(hist);
    } catch (error) {
      console.error('Failed to save stock state:', error);
      alert('데이터 저장 중 오류가 발생했습니다.');
    }
  }, []);

  // Handle Inventory Transaction (In / Out)
  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId || txQty <= 0 || !txOperator.trim()) {
      alert('모든 필수 항목을 입력해 주세요.');
      return;
    }

    const item = stockItems.find(i => i.id === selectedItemId);
    if (!item) return;

    if (txType === 'out' && item.currentStock < txQty) {
      alert('출고 수량이 현재 재고보다 많을 수 없습니다.');
      return;
    }

    const newQty = txType === 'in' ? item.currentStock + txQty : item.currentStock - txQty;
    
    // Update Items Array
    const updatedItems = stockItems.map(i => 
      i.id === selectedItemId 
        ? { ...i, currentStock: newQty, updatedAt: new Date().toISOString().split('T')[0] }
        : i
    );

    // Create History Log
    const newLog: StockHistory = {
      id: generateUniqueId(),
      itemId: selectedItemId,
      itemName: item.name,
      type: txType,
      quantity: txQty,
      date: new Date().toISOString().split('T')[0],
      memo: txMemo,
      operator: txOperator
    };

    syncData(updatedItems, [newLog, ...history]);
    
    // Reset form
    setSelectedItemId('');
    setTxQty(1);
    setTxMemo('');
    setTxOperator('');
    setIsTxOpen(false);
  };

  // Handle New Item Creation
  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItemName.trim() || newItemThreshold < 0 || newItemInitialStock < 0) {
      alert('올바른 약물 기본 정보를 기입해 주세요.');
      return;
    }

    const newItem: StockItem = {
      id: generateUniqueId(),
      name: newItemName,
      category: newItemCategory,
      currentStock: newItemInitialStock,
      minThreshold: newItemThreshold,
      unit: newItemUnit,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const newLog: StockHistory = {
      id: generateUniqueId(),
      itemId: newItem.id,
      itemName: newItem.name,
      type: 'in',
      quantity: newItemInitialStock,
      date: new Date().toISOString().split('T')[0],
      memo: '신규 약물 등록 (최초 입고)',
      operator: '관리자'
    };

    syncData([...stockItems, newItem], [newLog, ...history]);
    
    // Reset Form
    setNewItemName('');
    setNewItemThreshold(5);
    setNewItemInitialStock(10);
    setIsItemFormOpen(false);
  };

  // Calculate stats
  const lowStockCount = useMemo(() => {
    return stockItems.filter(i => i.currentStock <= i.minThreshold).length;
  }, [stockItems]);

  const filteredItems = useMemo(() => {
    if (filterType === 'low') {
      return stockItems.filter(i => i.currentStock <= i.minThreshold);
    }
    return stockItems;
  }, [stockItems, filterType]);

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
              간호 재고 관리
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

      {/* Main Grid: 2-Columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stock Inventory Table (8-cols) */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">원내 약물 재고 현황</h2>
              <p className="text-neutral-400 text-xs">보톡스, 필러 및 소모성 약품들의 입출고 잔여 수량 리스트입니다.</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsItemFormOpen(true)}
                className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors font-medium"
              >
                + 약물 품목 등록
              </button>
              <button
                onClick={() => setIsTxOpen(true)}
                className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-colors"
              >
                입/출고 기록 등록
              </button>
            </div>
          </div>

          {/* Quick Warning Bar */}
          {lowStockCount > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs text-red-400 font-semibold">
                  현재 기준량 미달로 재고 보충이 필요한 약물이 {lowStockCount}개 있습니다.
                </span>
              </div>
              <button
                onClick={() => setFilterType(prev => prev === 'low' ? 'all' : 'low')}
                className="text-[10px] text-red-400 font-bold hover:underline"
              >
                {filterType === 'low' ? '전체 보기' : '부족 품목만 필터링'}
              </button>
            </div>
          )}

          {/* Create Item Modal/Form (Collapsible) */}
          {isItemFormOpen && (
            <form onSubmit={handleCreateItemSubmit} className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-cyan-400">새로운 약물 품목 추가</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">약물 명칭</span>
                  <input
                    type="text"
                    placeholder="예: 제오민 50U"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">카테고리</span>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as 'botox' | 'filler' | 'skinbooster' | 'etc')}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="botox">보톡스</option>
                    <option value="filler">필러</option>
                    <option value="skinbooster">스킨부스터</option>
                    <option value="etc">기타 소모품</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">최소 임계수량 (경고)</span>
                  <input
                    type="number"
                    value={newItemThreshold}
                    onChange={(e) => setNewItemThreshold(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">최초 재고량</span>
                  <input
                    type="number"
                    value={newItemInitialStock}
                    onChange={(e) => setNewItemInitialStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <span className="text-[10px] text-neutral-500">기본 단위:</span>
                  <input 
                    type="text" 
                    value={newItemUnit} 
                    onChange={(e) => setNewItemUnit(e.target.value)} 
                    className="bg-transparent text-[10px] text-white border-b border-neutral-800 outline-none w-16"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsItemFormOpen(false)} 
                    className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded"
                  >
                    취소
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-cyan-500 text-black font-bold text-xs rounded"
                  >
                    품목 등록
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Transaction Entry Form (Collapsible) */}
          {isTxOpen && (
            <form onSubmit={handleTransactionSubmit} className="p-5 bg-neutral-950 border border-cyan-500/20 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-cyan-400">약물 입고 / 출고 등록</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">대상 약품 선택</span>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="">선택해 주세요</option>
                    {stockItems.map(item => (
                      <option key={item.id} value={item.id}>{item.name} (현재: {item.currentStock}{item.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">입출고 유형</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTxType('out')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        txType === 'out' ? 'bg-red-950 border-red-500 text-red-400' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                      }`}
                    >
                      출고 (불출)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxType('in')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        txType === 'in' ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                      }`}
                    >
                      입고
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">수량 (바이알/시린지)</span>
                  <input
                    type="number"
                    value={txQty}
                    onChange={(e) => setTxQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">사유 및 메모</span>
                  <input
                    type="text"
                    placeholder="예: 2번 시술실 불출, 신규 입고 등"
                    value={txMemo}
                    onChange={(e) => setTxMemo(e.target.value)}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">담당자 이름 *</span>
                  <input
                    type="text"
                    placeholder="예: 박간호"
                    value={txOperator}
                    onChange={(e) => setTxOperator(e.target.value)}
                    className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsTxOpen(false)} 
                  className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-lg"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-cyan-500 text-black font-bold text-xs rounded-lg"
                >
                  반영하기
                </button>
              </div>
            </form>
          )}

          {/* Stock List table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-neutral-500 text-xs">재고 정보 동기화 중...</p>
            </div>
          ) : (
            <div className="border border-neutral-900 rounded-3xl overflow-hidden bg-neutral-950/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider border-b border-neutral-900">
                    <tr>
                      <th className="px-6 py-4">구분</th>
                      <th className="px-6 py-4">약물 품목명</th>
                      <th className="px-6 py-4">현재 재고</th>
                      <th className="px-6 py-4">안전 기준(최소)</th>
                      <th className="px-6 py-4">재고 상태</th>
                      <th className="px-6 py-4">마지막 갱신</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {filteredItems.map(item => {
                      const isLow = item.currentStock <= item.minThreshold;
                      return (
                        <tr key={item.id} className="hover:bg-neutral-900/20">
                          <td className="px-6 py-4 font-semibold">
                            {item.category === 'botox' && '보톡스'}
                            {item.category === 'filler' && '필러'}
                            {item.category === 'skinbooster' && '스킨부스터'}
                            {item.category === 'etc' && '소모품'}
                          </td>
                          <td className="px-6 py-4 font-bold text-white text-sm">{item.name}</td>
                          <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                            {item.currentStock} {item.unit}
                          </td>
                          <td className="px-6 py-4 font-mono text-neutral-500">
                            {item.minThreshold} {item.unit}
                          </td>
                          <td className="px-6 py-4">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                재고 부족
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                안전 (적정)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-neutral-500">{item.updatedAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>

        {/* Right Column: Transaction Logs (4-cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">실시간 입출고 로그</h2>
            <p className="text-neutral-400 text-xs">최근에 실행된 불출 및 입고 내역입니다.</p>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
            
            <h3 className="text-base font-bold text-cyan-400 border-b border-neutral-900 pb-3">
              최근 10개 히스토리
            </h3>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {isLoading ? (
                <p className="text-neutral-600 text-xs text-center py-10">기록 불러오는 중...</p>
              ) : history.length === 0 ? (
                <p className="text-neutral-600 text-xs text-center py-10">입출고 기록이 없습니다.</p>
              ) : (
                history.map(log => (
                  <div 
                    key={log.id}
                    className="p-3.5 bg-neutral-900/50 border border-neutral-900 rounded-xl space-y-2 hover:border-neutral-800 transition-colors text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                        log.type === 'in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {log.type === 'in' ? '입고' : '출고'}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">{log.date}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white">{log.itemName}</h4>
                      <p className="text-neutral-400 mt-1">수량: <span className="font-bold text-white">{log.quantity}</span></p>
                      {log.memo && <p className="text-neutral-500 mt-0.5">사유: {log.memo}</p>}
                    </div>

                    <div className="pt-2 border-t border-neutral-950 flex justify-between items-center text-[9px] text-neutral-500">
                      <span>담당자:</span>
                      <span className="font-semibold text-neutral-300">{log.operator}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
