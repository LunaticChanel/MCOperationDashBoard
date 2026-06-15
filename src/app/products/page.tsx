'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ProductItem {
  id: string;
  name: string;
  category: 'syringe' | 'sanitary' | 'fluid' | 'device';
  specification: string;
  boxPrice: number;
  unitPrice: number;
  supplier: string;
  manufacturer: string;
}

const PRODUCT_DATA: ProductItem[] = [
  // 주사기 및 니들류 (Syringe & Needles)
  {
    id: 'prod-1',
    name: '일회용 인슐린 주사기 1cc (BD)',
    category: 'syringe',
    specification: '31G x 8mm, 100개입/Box',
    boxPrice: 28000,
    unitPrice: 280,
    supplier: '엠디헬스케어',
    manufacturer: 'BD (미국)'
  },
  {
    id: 'prod-2',
    name: '정밀 미세니들 30G',
    category: 'syringe',
    specification: '30G 4mm, 100개입/Box',
    boxPrice: 35000,
    unitPrice: 350,
    supplier: '제일메디칼',
    manufacturer: 'JBP (일본)'
  },
  {
    id: 'prod-3',
    name: '일회용 주사기 3cc (성광)',
    category: 'syringe',
    specification: '23G x 1인치, 100개입/Box',
    boxPrice: 12000,
    unitPrice: 120,
    supplier: '엠디헬스케어',
    manufacturer: '성광제약'
  },

  // 위생 및 거즈류 (Sanitary)
  {
    id: 'prod-4',
    name: '멸균 거즈 3x3 (대형)',
    category: 'sanitary',
    specification: '8ply, 200개입/Box',
    boxPrice: 8500,
    unitPrice: 42.5,
    supplier: '메디숍',
    manufacturer: '동아위생'
  },
  {
    id: 'prod-5',
    name: '알코올 스왑 (일회용)',
    category: 'sanitary',
    specification: '이소프로판올 70%, 200개입/Box',
    boxPrice: 6000,
    unitPrice: 30,
    supplier: '메디숍',
    manufacturer: '그린제약'
  },

  // 앰플 및 수액 라인 (Fluid)
  {
    id: 'prod-6',
    name: '생리식염수 20ml (대조용)',
    category: 'fluid',
    specification: '20ml 앰플, 50개입/Box',
    boxPrice: 15000,
    unitPrice: 300,
    supplier: '엠디메디칼',
    manufacturer: '중외제약'
  },
  {
    id: 'prod-7',
    name: '나비침 수액세트',
    category: 'fluid',
    specification: '23G, 50개입/Box',
    boxPrice: 22000,
    unitPrice: 440,
    supplier: '엠디메디칼',
    manufacturer: '세운메디칼'
  },

  // 레이저/의료기 소모품 (Device)
  {
    id: 'prod-8',
    name: '초음파 전용 겔 (울쎄라용)',
    category: 'device',
    specification: '5L 대용량 리필 + 공병세트',
    boxPrice: 18000,
    unitPrice: 18000, // 단품
    supplier: '대웅메디칼',
    manufacturer: '파커 (Parker)'
  },
  {
    id: 'prod-9',
    name: '레이저 보안경 (의료진용)',
    category: 'device',
    specification: '다파장 (IPL, Alexandrite 지원)',
    boxPrice: 120000,
    unitPrice: 120000, // 단품
    supplier: '대웅메디칼',
    manufacturer: '필트론 (Filtron)'
  }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'syringe' | 'sanitary' | 'fluid' | 'device'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return PRODUCT_DATA.filter(prod => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      
      const searchWord = searchTerm.toLowerCase();
      const matchesSearch = prod.name.toLowerCase().includes(searchWord) ||
                            prod.manufacturer.toLowerCase().includes(searchWord) ||
                            prod.supplier.toLowerCase().includes(searchWord);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const getCategoryName = (cat: string) => {
    const mapping = {
      syringe: '주사기/니들류',
      sanitary: '위생/거즈류',
      fluid: '앰플/수액라인',
      device: '레이저/소모품'
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
              소모품 단가표
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
          <h2 className="text-2xl font-extrabold tracking-tight text-white">소모품 단가 정리표</h2>
          <p className="text-neutral-400 text-sm">원내에서 정기 청구 및 소모하는 주사기, 위생품 등의 구매 정보 및 대조 단가표입니다.</p>
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
              placeholder="제품명, 수입/제조사, 납품사 키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-neutral-200 placeholder-neutral-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as const, label: '전체 소모품' },
              { id: 'syringe' as const, label: '주사기 / 니들' },
              { id: 'sanitary' as const, label: '위생 / 거즈류' },
              { id: 'fluid' as const, label: '앰플 / 수액라인' },
              { id: 'device' as const, label: '레이저 / 의료기소모품' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 border-cyan-500 text-black font-bold'
                    : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards List */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 border border-neutral-900 rounded-3xl text-center text-neutral-500 text-sm">
            조회된 소모품 품목이 없습니다. 다른 키워드를 검색해 주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map(prod => (
              <div 
                key={prod.id}
                className="p-6 bg-neutral-950 border border-neutral-900 hover:border-cyan-500/20 rounded-2xl flex flex-col justify-between space-y-6 transition-all"
              >
                <div className="space-y-4">
                  {/* Category & Specifications */}
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-500">
                    <span className="font-bold bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                      {getCategoryName(prod.category)}
                    </span>
                    <span>규격: {prod.specification}</span>
                  </div>

                  {/* Names & Suppliers */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-white leading-tight font-serif">
                      {prod.name}
                    </h3>
                    <div className="flex gap-3 text-[10px] text-neutral-500">
                      <span>제조/수입사: {prod.manufacturer}</span>
                      <span>•</span>
                      <span>구매처: {prod.supplier}</span>
                    </div>
                  </div>
                </div>

                {/* Price info layout */}
                <div className="pt-4 border-t border-neutral-900/50 grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-neutral-500 uppercase block font-semibold">박스/팩 단가</span>
                    <span className="text-base font-bold text-white font-mono">
                      {formatPrice(prod.boxPrice)}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[9px] text-neutral-500 uppercase block font-semibold">개당 환산 단가</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">
                      {formatPrice(prod.unitPrice)}
                    </span>
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
