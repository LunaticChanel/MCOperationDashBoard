'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Language = 'ko' | 'en' | 'zh_tw' | 'zh_cn' | 'ja';

interface TreatmentItem {
  id: string;
  category: 'lifting' | 'pigment' | 'botox' | 'filler' | 'skinbooster';
  names: Record<Language, string>;
  pinyins?: Record<'zh_tw' | 'zh_cn', string>; // Pinyin pronunciation for Chinese
  prices: {
    krw: number; // Korean Won
    usd?: number; // USD estimation or reference
  };
  duration: string;
  descriptions: Record<Language, string>;
}

const TREATMENT_DATA: TreatmentItem[] = [
  // 리프팅 (Lifting)
  {
    id: 'lift-1',
    category: 'lifting',
    names: {
      ko: "울쎄라 리프팅 (100샷)",
      en: "Ulthera Lifting (100 Shots)",
      zh_tw: "極線音波拉提 (100發)",
      zh_cn: "超声刀拉提 (100发)",
      ja: "ウルセラリフト (100ショット)"
    },
    pinyins: {
      zh_tw: "Jíxiàn yīnbō lātí (100 fā)",
      zh_cn: "Chāoshēngdāo lātí (100 fā)"
    },
    prices: { krw: 350000 },
    duration: "20분",
    descriptions: {
      ko: "고강도 집속 초음파(HIFU)를 이용해 피부 속 깊은 근막층까지 당겨주는 프리미엄 리프팅 시술.",
      en: "Premium HIFU lifting treatment that targets the deep SMAS layer for powerful sagging improvement.",
      zh_tw: "利用高強度聚焦超音波 (HIFU) 拉提深層筋膜層的頂級拉提療程。",
      zh_cn: "利用高强度聚焦超声波 (HIFU) 拉提深层筋膜层的顶级拉提疗程。",
      ja: "高密度焦点式超音波(HIFU)を用いて、皮膚の奥深くにある筋膜層まで引き上げるプレミアムリフティング施術。"
    }
  },
  {
    id: 'lift-2',
    category: 'lifting',
    names: {
      ko: "슈링크 유니버스 (300샷)",
      en: "Shrink Universe (300 Shots)",
      zh_tw: "第三代海芙音波 (300發)",
      zh_cn: "第三代海芙音波 (300发)",
      ja: "シュリンクユニバース (300ショット)"
    },
    pinyins: {
      zh_tw: "Dìsān dài hǎifú yīnbō (300 fā)",
      zh_cn: "Dìsān dài hǎifú yīnbō (300 fā)"
    },
    prices: { krw: 150000 },
    duration: "15분",
    descriptions: {
      ko: "2가지 모드의 초음파 에너지를 조사하여 빠른 탄력 개선과 V라인을 연출하는 리프팅.",
      en: "Uses dual ultrasonic modes to quickly enhance skin elasticity and create a sharp V-line contour.",
      zh_tw: "運用雙重音波模式快速提升肌膚彈力，塑造精緻V臉輪廓。",
      zh_cn: "运用双重音波模式快速提升肌肤弹力，塑造精致V脸轮廓。",
      ja: "2つのモード의 초음파 에너지를 조사하여 빠른 탄력 개선과 V라인을 연출하는 리프팅。"
    }
  },

  // 색소 (Pigment / Laser)
  {
    id: 'pig-1',
    category: 'pigment',
    names: {
      ko: "피코 토닝 (전체페이스)",
      en: "Pico Toning (Full Face)",
      zh_tw: "皮秒雷射淨膚 (全臉)",
      zh_cn: "皮秒激光净肤 (全脸)",
      ja: "ピコトーニング (フルフェイス)"
    },
    pinyins: {
      zh_tw: "Pímiǎo léishè jìngfū (Quán liǎn)",
      zh_cn: "Pímiǎo jīguāng jìngfū (Quán liǎn)"
    },
    prices: { krw: 99000 },
    duration: "10분",
    descriptions: {
      ko: "피코초 단위의 빠른 레이저 조사로 피부 손상을 최소화하며 기미, 잡티 등 색소를 깨뜨리는 토닝 시술.",
      en: "Ultra-fast picosecond laser targeting pigmentation, blemishes, and melasma with minimal downtime.",
      zh_tw: "利用極速皮秒雷射精準擊碎黑色素，改善肝斑、斑點，將肌膚受損降至最低。",
      zh_cn: "利用极速皮秒激光精准击碎黑色素，改善肝斑、斑点，将肌肤受损降至最低。",
      ja: "ピコ秒単位의 빠른 레이저 조사로 피부 손상을 최소화하며 기미, 잡티 등 색소를 깨뜨리는 토닝 시술。"
    }
  },

  // 보톡스 (Botox)
  {
    id: 'bot-1',
    category: 'botox',
    names: {
      ko: "사각턱 보톡스 (국산 50U)",
      en: "Masseter Botox (Korean 50U)",
      zh_tw: "瘦臉針 / 咀嚼肌肉毒 (國產 50U)",
      zh_cn: "瘦脸针 / 咀嚼肌肉毒 (国产 50U)",
      ja: "エラボトックス (韓国製 50U)"
    },
    pinyins: {
      zh_tw: "Shòuliǎn zhēn / Jǔjué jī ròudú (Guócǎn wǔshí U)",
      zh_cn: "Shòuliǎn zhēn / Jǔjué jī ròudú (Guócǎn wǔshí U)"
    },
    prices: { krw: 39000 },
    duration: "5분",
    descriptions: {
      ko: "저작근의 부피를 줄여 슬림하고 부드러운 얼굴 라인을 만드는 시술.",
      en: "Reduces the volume of the masseter muscles to create a slimmer and smoother jawline contour.",
      zh_tw: "放鬆發達的咀嚼肌以縮小肌肉體積，打造精緻流暢的瓜子臉。",
      zh_cn: "放松发达的咀嚼肌以缩小肌肉体积，打造精致流畅的瓜子脸。",
      ja: "咬筋의 볼륨을 줄여 슬림하고 부드러운 얼굴 라인을 만드는 시술。"
    }
  },
  {
    id: 'bot-2',
    category: 'botox',
    names: {
      ko: "주름 보톡스 (이마/미간/눈가 선택 1부위)",
      en: "Wrinkle Botox (Forehead / Glabella / Eyes - Select 1)",
      zh_tw: "除皺肉毒 (額頭/眉間/眼角 任選1部位)",
      zh_cn: "除皱肉毒 (额头/眉间/眼角 任选1部位)",
      ja: "シワボトックス (額/眉間/目元から1部位選択)"
    },
    pinyins: {
      zh_tw: "Chúzhòu ròudú (Étóu/Méijiān/Yǎnjiǎo Rèn xuǎn yī bùwèi)",
      zh_cn: "Chúzhòu ròudú (Étóu/Méijiān/Yǎnjiǎo Rèn xuǎn yī bùwèi)"
    },
    prices: { krw: 19000 },
    duration: "5분",
    descriptions: {
      ko: "표정 근육을 일시적으로 마비시켜 이마, 미간, 눈가 등의 미세 표정 주름을 완화시키는 시술.",
      en: "Temporarily relaxes expression muscles to smooth out fine lines on forehead, frown lines, or crow's feet.",
      zh_tw: "暫時放鬆表情肌，有效改善額頭、眉間、眼周等動態表情紋。",
      zh_cn: "暂时放松表情肌，有效改善额头、眉间、眼周等动态表情纹。",
      ja: "表情筋을 일시적으로 마비시켜 이마, 미간, 눈가 등의 미세 표정 주름을 완화시키는 시술。"
    }
  },

  // 필러 (Filler)
  {
    id: 'fil-1',
    category: 'filler',
    names: {
      ko: "국산 히알루론산 필러 (1cc)",
      en: "Korean HA Filler (1cc)",
      zh_tw: "玻尿酸豐盈 (國產 1cc)",
      zh_cn: "玻尿酸丰盈 (国产 1cc)",
      ja: "韓国製ヒアル론산 필러 (1cc)"
    },
    pinyins: {
      zh_tw: "Bōniàosuān fēngyíng (Guócǎn yī cc)",
      zh_cn: "Bōniàosuān fēngyíng (Guócǎn yī cc)"
    },
    prices: { krw: 120000 },
    duration: "10분",
    descriptions: {
      ko: "볼륨이 부족한 이마, 코, 볼, 턱 끝 등에 주입하여 입체적인 볼륨감을 형성해 주는 시술.",
      en: "Injected into volume-deficient areas such as forehead, nose, cheeks, or chin for a dimensional facial profile.",
      zh_tw: "注入玻尿酸以填補額頭、鼻樑、雙頰、下巴等凹陷部位，重塑立體飽滿感。",
      zh_cn: "注入玻尿酸以填补额头、鼻梁、双颊、下巴等凹陷部位，重塑立体饱满感。",
      ja: "볼륨이 부족한 이마, 코, 볼, 턱 끝 등에 주입하여 입체적인 볼륨감을 형성해 주는 시술。"
    }
  },

  // 스킨부스터 (Skin Booster)
  {
    id: 'sb-1',
    category: 'skinbooster',
    names: {
      ko: "리쥬란 힐러 (2cc)",
      en: "Rejuran Healer (2cc)",
      zh_tw: "麗珠蘭逆齡針 (2cc)",
      zh_cn: "丽珠兰逆龄针 (2cc)",
      ja: "リジュランヒーラー (2cc)"
    },
    pinyins: {
      zh_tw: "Lìzhūlán nìlíng zhēn (Liǎng cc)",
      zh_cn: "Lìzhūlán nìlíng zhēn (Liǎng cc)"
    },
    prices: { krw: 250000 },
    duration: "15분",
    descriptions: {
      ko: "연어 유래 PN 성분을 진피층에 주입하여 자가 피부 재생 능력을 활성화하고 탄력, 유수분 밸런스를 복원하는 시술.",
      en: "Polynucleotide (PN) extracted from salmon injected into the dermis to activate skin regeneration and moisture balance.",
      zh_tw: "將鮭魚提取的 PN 成分注入真皮層，激活自體肌膚再生力，修復彈力與水油平衡。",
      zh_cn: "将鲑鱼提取的 PN 成分注入真皮层，激活自体肌肤再生力，修复弹性与水油平衡。",
      ja: "サーモン由来のPN成分を真皮層に注入し、自己皮膚再生能力を活性化させ、弾力, 水分バランスを復元する施術。"
    }
  }
];

export default function MenuPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ko');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lifting' | 'pigment' | 'botox' | 'filler' | 'skinbooster'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return TREATMENT_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      const searchWord = searchTerm.toLowerCase();
      const nameMatch = item.names[selectedLanguage].toLowerCase().includes(searchWord) ||
                        item.names.ko.toLowerCase().includes(searchWord); // Always fallback/match with Korean search
      
      const descriptionMatch = item.descriptions[selectedLanguage].toLowerCase().includes(searchWord);
      
      const pinyinMatch = item.pinyins
        ? (item.pinyins.zh_tw.toLowerCase().includes(searchWord) || item.pinyins.zh_cn.toLowerCase().includes(searchWord))
        : false;

      return matchesCategory && (nameMatch || descriptionMatch || pinyinMatch);
    });
  }, [selectedCategory, selectedLanguage, searchTerm]);

  // Tax calculation helper (approximate reference)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const getTranslatedCategoryName = (cat: string) => {
    const mapping: Record<Language, Record<string, string>> = {
      ko: { all: '전체', lifting: '리프팅', pigment: '색소/토닝', botox: '보톡스', filler: '필러', skinbooster: '스킨부스터' },
      en: { all: 'All', lifting: 'Lifting', pigment: 'Pigmentation', botox: 'Botox', filler: 'Filler', skinbooster: 'Skin Booster' },
      zh_tw: { all: '全部', lifting: '拉提/音波', pigment: '皮秒/淡斑', botox: '肉毒除皺', filler: '玻尿酸', skinbooster: '皮膚水光針' },
      zh_cn: { all: '全部', lifting: '拉提/音波', pigment: '皮秒/淡斑', botox: '肉毒除皱', filler: '玻尿酸', skinbooster: '皮肤水光针' },
      ja: { all: '全体', lifting: 'リフティング', pigment: 'シミ/トーニング', botox: 'ボトックス', filler: 'フィラー', skinbooster: 'スキンブースター' }
    };
    return mapping[selectedLanguage][cat] || cat;
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
              다국어 수가표
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
        
        {/* Title and Language Select */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Medical Glow 수가표 (Price List)</h2>
            <p className="text-neutral-400 text-xs">글로벌 마케팅 및 다국어 상담 시 활용 가능한 외화 대응 시술 단가 정보판입니다.</p>
          </div>

          {/* Language Selector */}
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-900 self-start">
            {[
              { code: 'ko', label: '한국어' },
              { code: 'en', label: 'English' },
              { code: 'zh_tw', label: '繁體中文(台/港)' },
              { code: 'zh_cn', label: '简体中文' },
              { code: 'ja', label: '日本語' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code as Language)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
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
              placeholder="시술 명칭 또는 설명 키워드 검색 (한글 매칭 기본 지원)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-neutral-200 placeholder-neutral-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as const, key: 'all' },
              { id: 'lifting' as const, key: 'lifting' },
              { id: 'pigment' as const, key: 'pigment' },
              { id: 'botox' as const, key: 'botox' },
              { id: 'filler' as const, key: 'filler' },
              { id: 'skinbooster' as const, key: 'skinbooster' }
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
                {getTranslatedCategoryName(cat.id)}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 border border-neutral-900 rounded-3xl text-center text-neutral-500 text-sm">
            조회된 시술이 없습니다. 다른 키워드를 입력해 주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="p-6 bg-neutral-950 border border-neutral-900 hover:border-cyan-500/20 rounded-2xl flex flex-col justify-between space-y-6 transition-all"
              >
                <div className="space-y-4">
                  {/* Category & Duration */}
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-500">
                    <span className="font-bold bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                      {getTranslatedCategoryName(item.category)}
                    </span>
                    <span>시술 소요 시간: {item.duration}</span>
                  </div>

                  {/* Names & Pinyins */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white leading-tight font-serif">
                      {item.names[selectedLanguage]}
                    </h3>
                    
                    {/* Fallback Korean name for clarity */}
                    {selectedLanguage !== 'ko' && (
                      <p className="text-xs text-neutral-500">원문명: {item.names.ko}</p>
                    )}

                    {/* Chinese Pinyin */}
                    {['zh_tw', 'zh_cn'].includes(selectedLanguage) && item.pinyins && (
                      <p className="text-xs text-cyan-500/80 font-mono italic">
                        Pinyin: {selectedLanguage === 'zh_tw' ? item.pinyins.zh_tw : item.pinyins.zh_cn}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.descriptions[selectedLanguage]}
                  </p>
                </div>

                {/* Price tag */}
                <div className="pt-4 border-t border-neutral-900/50 flex justify-between items-end">
                  <span className="text-[10px] text-neutral-500 block uppercase">시술 수가</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-cyan-400 font-mono">
                      {formatPrice(item.prices.krw)}
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">※ 부가세 10% 별도</span>
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
