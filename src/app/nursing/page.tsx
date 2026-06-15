'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface MixGuide {
  id: string;
  drugName: string;
  standardVolume: string;
  recommendedSaline: number; // in ml/cc
  concentration: string; // 믹스 후 농도 안내
  instructions: string[];
}

const MIX_GUIDES: MixGuide[] = [
  {
    id: 'mix-1',
    drugName: '보툴렉스 / 코어톡스 (100U)',
    standardVolume: '100 Units / 1바이알',
    recommendedSaline: 2.5,
    concentration: '0.1cc(인슐린 주사기 10눈금) = 4 Units',
    instructions: [
      '생리식염수 2.5cc를 주사기로 흡입하여 바이알에 주입합니다.',
      '진공 상태이므로 식염수가 자동으로 빨려 들어갑니다.',
      '강하게 흔들지 말고 바이알을 천천히 돌려가며 용해시킵니다.',
      '희석 후 냉장 보관(2~8°C)하며, 24시간 이내 사용을 권장합니다.'
    ]
  },
  {
    id: 'mix-2',
    drugName: '보툴렉스 (50U)',
    standardVolume: '50 Units / 1바이알',
    recommendedSaline: 1.25,
    concentration: '0.1cc(인슐린 주사기 10눈금) = 4 Units',
    instructions: [
      '생리식염수 1.25cc를 주사기로 흡입하여 바이알에 주입합니다.',
      '거품이 나지 않도록 벽면을 타고 흐르도록 천천히 주입합니다.',
      '완전히 용해될 때까지 수평으로 천천히 흔들어 줍니다.'
    ]
  },
  {
    id: 'mix-3',
    drugName: '제오민 / 엘러간 (100U - 고농도 희석)',
    standardVolume: '100 Units / 1바이알',
    recommendedSaline: 2.0,
    concentration: '0.1cc(인슐린 주사기 10눈금) = 5 Units',
    instructions: [
      '정밀 주름 시술을 위해 생리식염수 2.0cc로 고농도 믹스를 수행합니다.',
      '눈가나 미간 등 미세 부위 주입 시 권장됩니다.'
    ]
  },
  {
    id: 'mix-4',
    drugName: '보툴렉스 (200U - 대용량 바디용)',
    standardVolume: '200 Units / 1바이알',
    recommendedSaline: 5.0,
    concentration: '0.1cc(인슐린 주사기 10눈금) = 4 Units',
    instructions: [
      '승모근, 종아리 등 바디 보톡스용 200U 바이알 믹스법입니다.',
      '생리식염수 5.0cc를 정밀 주입하여 희석합니다.'
    ]
  }
];

export default function NursingPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dilution Calculator State
  const [calcVialUnits, setCalcVialUnits] = useState<number>(100);
  const [calcSalineInput, setCalcSalineInput] = useState<string>('2.5');
  const [targetDoseUnits, setTargetDoseUnits] = useState<number>(10);

  const filteredGuides = useMemo(() => {
    return MIX_GUIDES.filter(g => 
      g.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.concentration.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Real-time calculation logic
  const calculationResult = useMemo(() => {
    const saline = parseFloat(calcSalineInput) || 0;
    if (saline <= 0 || calcVialUnits <= 0 || targetDoseUnits <= 0) {
      return {
        unitPerCc: 0,
        syringeCc: 0,
        syringeGrads: 0 // 1cc 인슐린 시린지 기준 눈금 수 (1cc = 100눈금)
      };
    }

    const unitPerCc = calcVialUnits / saline;
    const syringeCc = targetDoseUnits / unitPerCc;
    const syringeGrads = syringeCc * 100;

    return {
      unitPerCc: Math.round(unitPerCc * 100) / 100,
      syringeCc: Math.round(syringeCc * 1000) / 1000,
      syringeGrads: Math.round(syringeGrads * 10) / 10
    };
  }, [calcVialUnits, calcSalineInput, targetDoseUnits]);

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
              간호 믹스 가이드
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
        
        {/* Left Column: Mix Calculator (5-cols) */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">보톡스 희석 계산기</h2>
            <p className="text-neutral-400 text-xs">식염수 믹스량에 따른 주사기 눈금(인슐린 1cc 시린지 기준) 환산 툴입니다.</p>
          </div>

          <div className="p-6 bg-neutral-950 border border-cyan-500/20 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
            
            <h3 className="text-base font-bold text-cyan-400 border-b border-neutral-900 pb-3">
              실시간 희석 계산기 (Dilution)
            </h3>

            {/* Input 1: Vial Size */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">1. 바이알 오리지널 용량 (Units)</label>
              <div className="flex gap-2">
                {[50, 100, 200].map(units => (
                  <button
                    key={units}
                    type="button"
                    onClick={() => setCalcVialUnits(units)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      calcVialUnits === units
                        ? 'bg-cyan-500 border-cyan-500 text-black font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {units} U
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Saline Volume */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">2. 희석용 생리식염수 주입량 (cc / ml)</label>
              <input
                type="number"
                step="0.05"
                placeholder="예: 2.5"
                value={calcSalineInput}
                onChange={(e) => setCalcSalineInput(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>

            {/* Input 3: Target Dose */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">3. 환자 주입 타겟 용량 (Units)</label>
              <input
                type="number"
                placeholder="예: 10"
                value={targetDoseUnits}
                onChange={(e) => setTargetDoseUnits(parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>

            {/* Output Display Area */}
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-4">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">환산 연산 결과</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-neutral-400 block">1cc 당 농도</span>
                  <span className="text-sm font-bold text-white font-mono">{calculationResult.unitPerCc} U</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-neutral-400 block">필요 주입 용량</span>
                  <span className="text-sm font-bold text-white font-mono">{calculationResult.syringeCc} cc</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 space-y-1">
                <span className="text-[9px] text-cyan-400 block font-semibold">1cc 시린지(100눈금) 주사기 기준</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                    {calculationResult.syringeGrads}
                  </span>
                  <span className="text-sm text-neutral-300">눈금만큼 흡입</span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                  ※ 인슐린 시린지 10눈금 = 0.1cc 입니다. 
                </p>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Column: Mix Guidelines (7-cols) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">원내 약물별 권장 믹스 가이드</h2>
            <p className="text-neutral-400 text-xs">안전하고 정밀한 용해 및 보관을 위해 정립된 간호 표준 매뉴얼입니다.</p>
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2">
            <svg className="w-5 h-5 text-neutral-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="제품명, 농도 정보로 빠른 필터링..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-neutral-200 placeholder-neutral-500"
            />
          </div>

          {/* Guide list */}
          <div className="space-y-4">
            {filteredGuides.length === 0 ? (
              <div className="py-10 border border-neutral-900 rounded-2xl text-center text-neutral-500 text-xs">
                매칭되는 믹스 매뉴얼이 없습니다.
              </div>
            ) : (
              filteredGuides.map(g => (
                <div 
                  key={g.id}
                  className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl hover:border-neutral-800 transition-all space-y-4"
                >
                  <div className="flex justify-between items-start border-b border-neutral-900 pb-3 gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{g.drugName}</h3>
                      <p className="text-[10px] text-neutral-500 mt-1">기준 규격: {g.standardVolume}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-cyan-400 block">
                        권장 식염수: {g.recommendedSaline} cc
                      </span>
                      <span className="text-[9px] text-neutral-500 block mt-0.5">({g.concentration})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider">용해 매뉴얼 및 주의사항</span>
                    <ol className="text-xs text-neutral-400 space-y-2 list-decimal pl-4 leading-normal">
                      {g.instructions.map((ins, idx) => (
                        <li key={idx}>{ins}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
