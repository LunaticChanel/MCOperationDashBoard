'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface PillItem {
  item_seq: string;
  item_name: string;
  entp_name: string;
  chart: string;
  item_image: string;
  print_front: string;
  print_back: string;
  drug_shape: string;
  color_class1: string;
  form_code_name: string;
}

const PILL_SHAPES = [
  { id: 'all', label: '전체 모양' },
  { id: '원형', label: '원형' },
  { id: '타원형', label: '타원형' },
  { id: '장방형', label: '장방형(긴 사각형)' },
  { id: '사각형', label: '사각형' },
  { id: '삼각형', label: '삼각형' },
  { id: '오각형', label: '오각형' },
  { id: '육각형', label: '육각형' }
];

const PILL_COLORS = [
  { id: 'all', label: '전체 색상' },
  { id: '하양', label: '하얀색' },
  { id: '노랑', label: '노란색' },
  { id: '주황', label: '주황색' },
  { id: '분홍', label: '분홍색' },
  { id: '빨강', label: '빨간색' },
  { id: '갈색', label: '갈색' },
  { id: '초록', label: '초록색' },
  { id: '파랑', label: '파란색' },
  { id: '청록', label: '청록색' }
];

const PILL_FORMS = [
  { id: 'all', label: '전체 제형' },
  { id: '정제', label: '정제(알약)' },
  { id: '경질캡슐', label: '경질캡슐' },
  { id: '연질캡슐', label: '연질캡슐' }
];

export default function PillPage() {
  const [printFront, setPrintFront] = useState('');
  const [selectedShape, setSelectedShape] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedForm, setSelectedForm] = useState('all');
  const [pills, setPills] = useState<PillItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const query = new URLSearchParams();
      if (printFront) query.append('print_front', printFront);
      if (selectedShape !== 'all') query.append('drug_shape', selectedShape);
      if (selectedColor !== 'all') query.append('color_class1', selectedColor);
      if (selectedForm !== 'all') query.append('form_code_name', selectedForm);

      const res = await fetch(`/api/pill?${query.toString()}`);
      if (!res.ok) throw new Error('API fetching failed');

      const data = await res.json();
      setPills(data.body?.items || []);
    } catch (err) {
      console.error(err);
      alert('식별 정보 검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [printFront, selectedShape, selectedColor, selectedForm]);

  const resetFilters = () => {
    setPrintFront('');
    setSelectedShape('all');
    setSelectedColor('all');
    setSelectedForm('all');
    setPills([]);
    setHasSearched(false);
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
              알약 식별 검색
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

      {/* Main Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Search Filter Panel (5-cols) */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">알약 식별 상세 필터</h2>
            <p className="text-neutral-400 text-xs">고객이 지참한 낱알의 모양, 각인, 색상 등을 바탕으로 매칭 의약품을 찾습니다.</p>
          </div>

          <form onSubmit={handleSearch} className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-6 relative">
            
            {/* Input: Print text */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">앞/뒷면 식별 문자 (각인)</label>
              <input
                type="text"
                placeholder="예: TYLENOL, 500, HM"
                value={printFront}
                onChange={(e) => setPrintFront(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Select: Shape */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">모양 선택</label>
              <select
                value={selectedShape}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500 transition-colors"
              >
                {PILL_SHAPES.map(shape => (
                  <option key={shape.id} value={shape.id}>{shape.label}</option>
                ))}
              </select>
            </div>

            {/* Select: Color */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">색상 선택</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500 transition-colors"
              >
                {PILL_COLORS.map(color => (
                  <option key={color.id} value={color.id}>{color.label}</option>
                ))}
              </select>
            </div>

            {/* Select: Form Code */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">제형 선택</label>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500 transition-colors"
              >
                {PILL_FORMS.map(form => (
                  <option key={form.id} value={form.id}>{form.label}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors"
              >
                필터 리셋
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : '식별 매칭 검색'}
              </button>
            </div>

          </form>
        </aside>

        {/* Right Column: Search Results List (7-cols) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">매칭 의약품 검색 결과</h2>
            <p className="text-neutral-400 text-xs">공공데이터포털 식약처 API 연계 실시간 매칭 목록입니다.</p>
          </div>

          {/* Results Display */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-neutral-500 text-xs">식약처 데이터베이스를 조회 중입니다...</p>
            </div>
          ) : !hasSearched ? (
            <div className="py-24 border border-dashed border-neutral-800 rounded-3xl text-center text-neutral-500 text-sm">
              왼쪽 필터에서 조건을 설정한 후 &quot;식별 매칭 검색&quot; 버튼을 눌러주세요.
            </div>
          ) : pills.length === 0 ? (
            <div className="py-24 border border-neutral-900 rounded-3xl text-center text-neutral-500 text-sm">
              매칭되는 식별 정보 의약품이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {pills.map((pill) => (
                <div 
                  key={pill.item_seq}
                  className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl hover:border-neutral-800 transition-all flex flex-col sm:flex-row gap-5"
                >
                  {/* Pill Image Placeholder / Real */}
                  <div className="w-24 h-24 bg-neutral-900 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-neutral-800 relative">
                    {pill.item_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={pill.item_image} 
                        alt={pill.item_name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-600 text-center px-2">이미지 없음</span>
                    )}
                  </div>

                  {/* Pill Spec Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[9px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                        {pill.form_code_name}
                      </span>
                      <h3 className="text-sm font-extrabold text-white mt-1 leading-relaxed">{pill.item_name}</h3>
                      <p className="text-[10px] text-neutral-500 mt-0.5">제조/수입사: {pill.entp_name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-900/50 text-[11px] text-neutral-400">
                      <div>
                        <span className="text-[9px] text-neutral-600 block uppercase">색상 및 외형</span>
                        <span>{pill.chart}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-600 block uppercase">모양 및 각인</span>
                        <span>
                          {pill.drug_shape} | 식별표시: F({pill.print_front || '없음'}) B({pill.print_back || '없음'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
