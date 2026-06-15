'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  isGuerrilla: boolean;
  category: 'lifting' | 'botox' | 'filler' | 'skin';
  price: number;
  originalPrice: number;
  description: string;
}

const EVENT_DATA: EventItem[] = [
  // 6월 이벤트 (June Events)
  {
    id: 'evt-june-1',
    title: 'Medical Glow 개원 1주년 감사제',
    subtitle: '울쎄라 300샷 + 리쥬란 힐러 2cc 패키지',
    period: '2026-06-01 ~ 2026-06-30',
    status: 'ongoing',
    isGuerrilla: false,
    category: 'lifting',
    price: 490000,
    originalPrice: 600000,
    description: '개원 1주년을 맞아 가장 인기가 많은 리프팅과 스킨부스터 시술을 결합한 스페셜 리쥬브네이션 패키지 프로모션.'
  },
  {
    id: 'evt-june-2',
    title: '대표원장님 생신 기념 게릴라 특가',
    subtitle: '사각턱 국산 보톡스 + 주름 보톡스 1부위',
    period: '2026-06-15 ~ 2026-06-18 (단 3일간)',
    status: 'ongoing',
    isGuerrilla: true,
    category: 'botox',
    price: 450000,
    originalPrice: 58000,
    description: '대표원장님 생신 주간을 맞아 단 3일간만 진행하는 보톡스 패키지 깜짝 할인 이벤트입니다.'
  },
  {
    id: 'evt-june-3',
    title: '이벤트 2: 여름 맞이 모공 스킨부스터 대축제',
    subtitle: '쥬베룩 볼륨 2cc + 진정 관리',
    period: '2026-06-01 ~ 2026-06-30',
    status: 'ongoing',
    isGuerrilla: false,
    category: 'skin',
    price: 180000,
    originalPrice: 240000,
    description: '여름철 늘어나는 모공과 흉터 개선을 위한 콜라겐 부스터 단독 할인 프로모션.'
  },
  
  // 예정된 이벤트 (Upcoming Events)
  {
    id: 'evt-july-1',
    title: '7월 한여름 쿨 서머 진정 패키지',
    subtitle: '크라이오 진정 관리 5회 + 토닝 5회',
    period: '2026-07-01 ~ 2026-07-31',
    status: 'upcoming',
    isGuerrilla: false,
    category: 'skin',
    price: 390000,
    originalPrice: 500000,
    description: '자외선이 강한 한여름, 열오른 피부 진정과 잡티 예방을 위한 토닝 결합 진정 케어 패키지.'
  },

  // 마감된 이벤트 (Ended Events)
  {
    id: 'evt-may-1',
    title: '5월 가정의 달 효도 리프팅 프로모션',
    subtitle: '슈링크 유니버스 400샷 + 아이 슈링크 100샷',
    period: '2026-05-01 ~ 2026-05-31',
    status: 'ended',
    isGuerrilla: false,
    category: 'lifting',
    price: 220000,
    originalPrice: 290000,
    description: '가정의 달을 맞아 부모님과 함께 동반 내원 시 추가 혜택을 제공했던 탄력 리프팅 패키지.'
  }
];

export default function EventsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'ended' | 'guerrilla'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lifting' | 'botox' | 'filler' | 'skin'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    return EVENT_DATA.filter(evt => {
      // Filter by Status / Guerrilla
      let matchesFilter = true;
      if (selectedFilter === 'ongoing') matchesFilter = evt.status === 'ongoing';
      else if (selectedFilter === 'upcoming') matchesFilter = evt.status === 'upcoming';
      else if (selectedFilter === 'ended') matchesFilter = evt.status === 'ended';
      else if (selectedFilter === 'guerrilla') matchesFilter = evt.isGuerrilla;

      // Filter by Category
      const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;

      // Filter by Search term
      const searchWord = searchTerm.toLowerCase();
      const matchesSearch = evt.title.toLowerCase().includes(searchWord) ||
                            evt.subtitle.toLowerCase().includes(searchWord) ||
                            evt.description.toLowerCase().includes(searchWord);

      return matchesFilter && matchesCategory && matchesSearch;
    });
  }, [selectedFilter, selectedCategory, searchTerm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const getCategoryName = (cat: string) => {
    const mapping = {
      lifting: '리프팅/탄력',
      botox: '보톡스/쁘띠',
      filler: '필러/볼륨',
      skin: '스킨부스터/관리'
    };
    return mapping[cat as keyof typeof mapping] || cat;
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
              이벤트 보드
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
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">시즌 및 게릴라 이벤트</h2>
          <p className="text-neutral-400 text-sm">개원 기념 특별 혜택 및 깜짝 게릴라 프로모션 시술 수가 판입니다.</p>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2">
            <svg className="w-5 h-5 text-neutral-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="이벤트 명칭, 패키지 구성, 키워드로 검색해 주세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-neutral-200 placeholder-neutral-500"
            />
          </div>

          {/* Status Filters & Category Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            
            {/* Status Filter Buttons */}
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-900">
              {[
                { id: 'all' as const, label: '전체' },
                { id: 'ongoing' as const, label: '진행 중' },
                { id: 'upcoming' as const, label: '예정됨' },
                { id: 'ended' as const, label: '마감됨' },
                { id: 'guerrilla' as const, label: '⚡ 게릴라' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all' as const, label: '전체 카테고리' },
                { id: 'lifting' as const, label: '리프팅' },
                { id: 'botox' as const, label: '보톡스' },
                { id: 'filler' as const, label: '필러' },
                { id: 'skin' as const, label: '스킨케어' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full border text-xs transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-800 border-neutral-700 text-white font-semibold'
                      : 'bg-transparent border-neutral-900 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="py-20 border border-neutral-900 rounded-3xl text-center text-neutral-500 text-sm">
            진행 중이거나 매칭되는 이벤트 프로모션이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map(evt => (
              <div 
                key={evt.id}
                className={`p-6 bg-neutral-950 border rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden transition-all ${
                  evt.isGuerrilla 
                    ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5 hover:border-cyan-500/60' 
                    : 'border-neutral-900 hover:border-neutral-800'
                }`}
              >
                {/* Guerrilla Badge Background Glow */}
                {evt.isGuerrilla && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full pointer-events-none"></div>
                )}

                <div className="space-y-4">
                  {/* Status, Category & Period */}
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold px-2 py-0.5 rounded ${
                        evt.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                        evt.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' :
                        'bg-neutral-900 text-neutral-500 border border-neutral-800'
                      }`}>
                        {evt.status === 'ongoing' && '진행중'}
                        {evt.status === 'upcoming' && '예정'}
                        {evt.status === 'ended' && '마감'}
                      </span>
                      {evt.isGuerrilla && (
                        <span className="font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                          ⚡ 게릴라
                        </span>
                      )}
                    </div>
                    <span>{getCategoryName(evt.category)}</span>
                  </div>

                  {/* Titles */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-white leading-tight font-serif">
                      {evt.title}
                    </h3>
                    <p className="text-sm text-cyan-400 font-medium">
                      {evt.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                {/* Bottom: Date & Price */}
                <div className="pt-4 border-t border-neutral-900/50 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-neutral-500 block uppercase font-semibold">이벤트 기간</span>
                    <span className="text-xs text-neutral-400 font-mono">{evt.period}</span>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-neutral-600 line-through font-mono">
                        {formatPrice(evt.originalPrice)}
                      </span>
                      <span className="text-[10px] text-cyan-500 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        -{Math.round((1 - evt.price / evt.originalPrice) * 100)}%
                      </span>
                    </div>
                    <span className="text-lg font-extrabold text-white font-mono block mt-1">
                      {formatPrice(evt.price)}
                    </span>
                    <span className="text-[9px] text-neutral-500 block">부가세 10% 별도</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
