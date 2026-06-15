'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Phrase {
  id: string;
  category: 'reception' | 'consult' | 'procedure' | 'checkout';
  korean: string;
  chinese: string; // Traditional Chinese (Taiwan/HK)
  pinyin: string; // Pronunciation guide
}

const CLINIC_INFO = {
  addressKo: "서울특별시 강남구 테헤란로 123, 리바이브의원 3층",
  addressZh: "首爾特別市江南區德黑蘭路 123, REVIV 診所 3 樓",
  addressZhPinyin: "Shǒu'ěr tèbié shì jiāngnán qū déhēilán lù yībǎi èrshísān, REVIV zhěnsuǒ sān lóu",
  phone: "02-1234-5678 (데스크 직통)",
  businessHours: "평일 10:00 - 20:00 | 토요일 10:00 - 16:00 (일요일 휴진)",
};

const TEMPLATE_PHRASES: Phrase[] = [
  // 접수 (Reception)
  {
    id: 'rec-1',
    category: 'reception',
    korean: "안녕하세요, 리바이브 클리닉입니다. 여권이나 신분증을 보여주세요.",
    chinese: "您好，歡迎光臨 REVIV 診所。請出示您的護照或身份證件。",
    pinyin: "Nín hǎo, huānyíng guānglín REVIV zhěnsuǒ. Qǐng chūshì nín de hùzhào huò shēnfèn zhèngjiàn."
  },
  {
    id: 'rec-2',
    category: 'reception',
    korean: "여기에 영문 이름과 연락처를 작성해 주세요.",
    chinese: "請在此處填寫您的英文姓名和聯絡電話。",
    pinyin: "Qǐng zài cǐchù tiánxiě nín de yīngwén xìngmíng hò liánluò diànhuà."
  },
  {
    id: 'rec-3',
    category: 'reception',
    korean: "잠시만 대기실에서 기다려 주시면 성함을 부르겠습니다.",
    chinese: "請在候診室稍候，我們稍後會呼喊您的名字。",
    pinyin: "Qǐng zài hòuzhěn shì shāohòu, wǒmen shāohòu huì hūhǎn nín de míngzì."
  },
  
  // 상담 (Consultation)
  {
    id: 'con-1',
    category: 'consult',
    korean: "오늘 어떤 시술에 관심이 있으신가요?",
    chinese: "請問您今天對什麼療程感興趣呢？",
    pinyin: "Qǐngwèn nín jīntiān duì shénme liáochéng gǎn xìngqù ne?"
  },
  {
    id: 'con-2',
    category: 'consult',
    korean: "대표원장님께서 직접 얼굴을 보고 맞춤형 상담을 진행할 예정입니다.",
    chinese: "代表院長將親自為您進行面診與量身定制的諮詢。",
    pinyin: "Dàibiǎo yuànzhǎng jiāng qīnzì wèi nín jìnxíng miànzhěn yǔ liángshēn dìngzhì de zīxún."
  },
  {
    id: 'con-3',
    category: 'consult',
    korean: "통증이 걱정되시면 시술 전에 마취 크림을 꼼꼼히 바르겠습니다.",
    chinese: "如果您擔心疼痛，我們會在療程前仔細為您塗抹麻醉霜。",
    pinyin: "Rúguǒ nín dānxīn téngtòng, wǒmen huì zài liáochéng qián zǐxì wèi nín túmǒ mázuì shuāng."
  },

  // 시술 (Procedure)
  {
    id: 'pro-1',
    category: 'procedure',
    korean: "시술실로 안내하겠습니다. 이쪽으로 오세요.",
    chinese: "我帶您去療程室。請往這邊走。",
    pinyin: "Wǒ dài nín qù liáochéng shì. Qǐng wǎng zhèbiān zǒu."
  },
  {
    id: 'pro-2',
    category: 'procedure',
    korean: "시술 중 뻐근하거나 아프시면 언제든지 말씀해 주세요.",
    chinese: "療程中如果感到酸脹或疼痛，請隨時告訴我。",
    pinyin: "Liáochéng zhōng rúguǒ gǎndào suānzhàng huò téngtòng, qǐng suíshí gàosù wǒ."
  },
  {
    id: 'pro-3',
    category: 'procedure',
    korean: "시술이 모두 끝났습니다. 차가운 팩으로 진정시켜 드리겠습니다.",
    chinese: "療程已經全部結束。我們將為您敷上冰袋鎮靜肌膚。",
    pinyin: "Liáochéng yǐjīng quánbù jiéshù. Wǒmen jiāng wèi nín fū shàng bīngdài zhènjìng jīfū."
  },
  {
    id: 'pro-4',
    category: 'procedure',
    korean: "시술 후 3~4일 동안은 음주, 사우나, 과격한 운동을 피하셔야 합니다.",
    chinese: "療程後 3 至 4 天內，請避免飲酒、去桑拿或進行劇烈運動。",
    pinyin: "Liáochéng hòu sān zhì sì tiān nèi, qǐng bìmiǎn yǐnjiǔ, qù sāngná huò jìnxíng jùliè yùndòng."
  },

  // 결제 및 퇴원 (Checkout)
  {
    id: 'chk-1',
    category: 'checkout',
    korean: "시술비는 총 OOO원 입니다. 카드로 결제하시겠습니까?",
    chinese: "療程費用總共是 OOO 韓元。請問您要付現還是刷卡？",
    pinyin: "Liáochéng fèiyòng zǒnggòng shì OOO Hányuán. Qǐngwèn nín yào fùxiàn háishì shuākǎ?"
  },
  {
    id: 'chk-2',
    category: 'checkout',
    korean: "텍스리펀(Tax Refund) 영수증을 챙겨 드릴까요?",
    chinese: "需要幫您準備退稅（Tax Refund）單據嗎？",
    pinyin: "Xūyào bāng nín zhǔnbèi tuìshuì (Tax Refund) dānjù ma?"
  },
  {
    id: 'chk-3',
    category: 'checkout',
    korean: "처방전이 발급되었습니다. 1층 약국에서 약을 타가시면 됩니다.",
    chinese: "處方箋已開立。您可以直接去 1 樓의 藥局拿藥。",
    pinyin: "Chùfāngjiān yǐ kāilì. Nín kěyǐ zhíjiē qù yī lóu de yàojú ná yào."
  }
];

export default function InterpreterPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'reception' | 'consult' | 'procedure' | 'checkout'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPhrases = TEMPLATE_PHRASES.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.korean.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.chinese.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.pinyin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              외국인 상담 통역기
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

      {/* Main Container: 2-Column layout on iPad / PC */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Phrases Finder (8-cols on large screens) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">상담 번체자 & 병음 상용구</h2>
            <p className="text-neutral-400 text-xs">자주 사용하는 문구를 복사하여 메신저에 붙여넣거나 아이패드를 고객에게 보여줄 수 있습니다.</p>
          </div>

          {/* Search and Category Filter */}
          <div className="space-y-4">
            <div className="flex items-center bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2">
              <svg className="w-5 h-5 text-neutral-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="검색어를 입력해 주세요 (한글, 중국어, 병음)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-neutral-200 placeholder-neutral-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all' as const, label: '전체 상용구' },
                { id: 'reception' as const, label: '1. 진료 접수' },
                { id: 'consult' as const, label: '2. 맞춤 상담' },
                { id: 'procedure' as const, label: '3. 시술 주의사항' },
                { id: 'checkout' as const, label: '4. 수납 및 처방' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
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

          {/* Phrase List */}
          <div className="space-y-4">
            {filteredPhrases.length === 0 ? (
              <div className="py-20 border border-neutral-900 rounded-2xl text-center text-neutral-500 text-sm">
                검색 조건에 맞는 상용구가 없습니다.
              </div>
            ) : (
              filteredPhrases.map(p => (
                <div 
                  key={p.id} 
                  className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl hover:border-neutral-800 transition-all space-y-4"
                >
                  {/* Category Label & Action Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                      {p.category === 'reception' && '진료 접수'}
                      {p.category === 'consult' && '상담'}
                      {p.category === 'procedure' && '시술/주의'}
                      {p.category === 'checkout' && '수납/처방'}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(p.chinese, `${p.id}-zh`)}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[11px] font-medium rounded border border-neutral-800 transition-colors"
                      >
                        {copiedId === `${p.id}-zh` ? '복사 완료!' : '중국어 복사'}
                      </button>
                      <button
                        onClick={() => handleCopy(`${p.chinese} (${p.pinyin})`, `${p.id}-all`)}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[11px] font-medium rounded border border-neutral-800 transition-colors"
                      >
                        {copiedId === `${p.id}-all` ? '복사 완료!' : '병음 포함 복사'}
                      </button>
                    </div>
                  </div>

                  {/* Multilingual Display Grid */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-600 font-bold block uppercase tracking-wider">Korean</span>
                      <p className="text-sm font-semibold text-neutral-300">{p.korean}</p>
                    </div>
                    
                    <div className="space-y-1 pt-1.5 border-t border-neutral-900/50">
                      <span className="text-[10px] text-cyan-500/70 font-bold block uppercase tracking-wider">Traditional Chinese (HK/TW)</span>
                      <p className="text-lg font-bold text-cyan-400 font-serif leading-relaxed">{p.chinese}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-600 font-bold block uppercase tracking-wider">Pinyin Pronunciation</span>
                      <p className="text-xs text-neutral-400 font-mono italic leading-relaxed">{p.pinyin}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Clinic Info & Resource (4-cols on large screens) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Quick Clinic Info Cards for Copying */}
          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full"></div>
            
            <h3 className="text-base font-bold text-cyan-400 border-b border-neutral-900 pb-3 flex items-center gap-2">
              <span>원내 기본 정보 리소스</span>
            </h3>

            {/* Address Resource */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400 font-bold">병원 주소 (한글)</span>
                <button
                  onClick={() => handleCopy(CLINIC_INFO.addressKo, 'info-ko')}
                  className="text-[10px] text-neutral-500 hover:text-white"
                >
                  {copiedId === 'info-ko' ? '복사됨' : '복사'}
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-normal">{CLINIC_INFO.addressKo}</p>
            </div>

            {/* Chinese Address Resource */}
            <div className="space-y-2 pt-3 border-t border-neutral-900">
              <div className="flex justify-between items-center">
                <span className="text-xs text-cyan-500/80 font-bold">병원 주소 (중문/번체)</span>
                <button
                  onClick={() => handleCopy(CLINIC_INFO.addressZh, 'info-zh')}
                  className="text-[10px] text-neutral-500 hover:text-white"
                >
                  {copiedId === 'info-zh' ? '복사됨' : '복사'}
                </button>
              </div>
              <p className="text-sm font-semibold text-cyan-400 font-serif leading-normal">{CLINIC_INFO.addressZh}</p>
              <p className="text-[10px] text-neutral-500 font-mono italic leading-relaxed">{CLINIC_INFO.addressZhPinyin}</p>
            </div>

            {/* Desk Phone Resource */}
            <div className="space-y-2 pt-3 border-t border-neutral-900">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400 font-bold">원내 직통 번호</span>
                <button
                  onClick={() => handleCopy(CLINIC_INFO.phone, 'info-phone')}
                  className="text-[10px] text-neutral-500 hover:text-white"
                >
                  {copiedId === 'info-phone' ? '복사됨' : '복사'}
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-normal">{CLINIC_INFO.phone}</p>
            </div>

            {/* Operating Hours */}
            <div className="space-y-2 pt-3 border-t border-neutral-900">
              <span className="text-xs text-neutral-400 font-bold block">원내 진료 시간</span>
              <p className="text-xs text-neutral-300 leading-normal">{CLINIC_INFO.businessHours}</p>
            </div>
          </div>

          {/* Guidelines for iPad Presentation */}
          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">iPad 2컬럼 레이아웃 가이드</h4>
            <ul className="text-xs text-neutral-500 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>외국인 고객 상담 시 본인의 태블릿이나 데스크탑 브라우저 화면을 분할하여 1:1로 활용할 수 있습니다.</li>
              <li>중국어 발음이 낯설 경우 문항 하단의 <strong>Pinyin 발음 가이드</strong>를 참조하여 천천히 대화해 보세요.</li>
              <li>긴급한 안내(주소 등)는 오른쪽 사이드바 리소스를 1클릭 복사하여 메시지로 직접 전송할 수 있습니다.</li>
            </ul>
          </div>
        </aside>

      </main>
    </div>
  );
}
