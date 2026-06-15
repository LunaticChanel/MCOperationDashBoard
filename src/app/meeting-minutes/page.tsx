'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface MeetingMinute {
  id: string;
  date: string;
  title: string;
  attendees: string;
  content: string;
  decisions: string;
  createdAt: string;
}

// Impure helper function declared outside component to satisfy react-hooks/purity lint rule
const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export default function MeetingMinutesPage() {
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendees, setAttendees] = useState('');
  const [content, setContent] = useState('');
  const [decisions, setDecisions] = useState('');

  // Load from LocalStorage inside client mount
  useEffect(() => {
    let active = true;

    const loadData = () => {
      try {
        const stored = localStorage.getItem('reviv_meeting_minutes');
        if (stored && active) {
          setMinutes(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load meeting minutes:', error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    // Defer setting state to microtask to prevent react-hooks/set-state-in-effect issues
    Promise.resolve().then(loadData);

    return () => {
      active = false;
    };
  }, []);

  // Save to LocalStorage helper
  const saveMinutes = useCallback((data: MeetingMinute[]) => {
    try {
      localStorage.setItem('reviv_meeting_minutes', JSON.stringify(data));
      setMinutes(data);
    } catch (error) {
      console.error('Failed to save meeting minutes:', error);
      alert('회의록 저장에 실패했습니다.');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date || !content.trim()) {
      alert('날짜, 안건 및 내용은 필수 항목입니다.');
      return;
    }

    if (editingId) {
      // Edit mode
      const updated = minutes.map(item => 
        item.id === editingId 
          ? {
              ...item,
              date,
              title,
              attendees,
              content,
              decisions,
            }
          : item
      );
      saveMinutes(updated);
      setEditingId(null);
    } else {
      // Create mode
      const newMinute: MeetingMinute = {
        id: generateUniqueId(),
        date,
        title,
        attendees,
        content,
        decisions,
        createdAt: new Date().toISOString(),
      };
      saveMinutes([newMinute, ...minutes]);
    }

    // Reset Form
    resetForm();
  };

  const handleEdit = (item: MeetingMinute) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDate(item.date);
    setAttendees(item.attendees);
    setContent(item.content);
    setDecisions(item.decisions);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('정말로 이 회의록을 삭제하시겠습니까?')) return;
    const filtered = minutes.filter(item => item.id !== id);
    saveMinutes(filtered);
  };

  const resetForm = () => {
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setAttendees('');
    setContent('');
    setDecisions('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const filteredMinutes = minutes.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.attendees.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-black text-white font-sans">
      <header className="border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-400 to-blue-200 font-serif">
              Medical Glow
            </Link>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              주간 회의록
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">주간 회의록</h2>
            <p className="text-neutral-400 text-sm">원내 주요 안건 및 결정된 공지 사항을 작성하고 보관합니다.</p>
          </div>
          <button
            onClick={() => {
              if (isFormOpen) resetForm();
              else setIsFormOpen(true);
            }}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-lg transition-all shadow-md shadow-cyan-500/10 self-start"
          >
            {isFormOpen ? '작성 취소' : '회의록 작성하기'}
          </button>
        </div>

        {/* Create/Edit Form (Collapsible) */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-6 relative">
            <h3 className="text-lg font-bold text-cyan-400">
              {editingId ? '회의록 수정' : '신규 회의록 작성'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 font-semibold block">회의 일자 *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs text-neutral-400 font-semibold block">회의 안건 (제목) *</label>
                <input
                  type="text"
                  placeholder="예: 6월 개원기념 이벤트 조율 및 신입 교육 일정"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">참석자</label>
              <input
                type="text"
                placeholder="예: 홍길동 원장, 김간호, 이데스크"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">회의 내용 (상세) *</label>
              <textarea
                placeholder="- 이벤트 홍보를 위한 다국어 팸플릿 구성 조율&#10;- 간호팀 약물 믹스 가이드라인 신규 직원 전파"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-colors font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-semibold block">결정 및 공지사항</label>
              <textarea
                placeholder="- 6/20까지 번체자 팸플릿 번역 완료 (마케팅팀)&#10;- 매일 수건 당번은 퇴근 전 다음 날 주간 순번 체크"
                rows={3}
                value={decisions}
                onChange={(e) => setDecisions(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-sm rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-lg transition-colors"
              >
                {editingId ? '수정 완료' : '저장하기'}
              </button>
            </div>
          </form>
        )}

        {/* Filter and Search Bar */}
        <div className="flex items-center bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2">
          <svg className="w-5 h-5 text-neutral-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="안건 제목, 참석자, 본문 내용 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-neutral-200 placeholder-neutral-500"
          />
        </div>

        {/* Meeting Minutes List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-500 text-xs">데이터 로드 중...</p>
          </div>
        ) : filteredMinutes.length === 0 ? (
          <div className="py-20 border border-neutral-900 rounded-3xl text-center text-neutral-500 text-sm">
            등록된 회의록이 없거나 검색 결과가 없습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMinutes.map((item) => (
              <article key={item.id} className="p-6 bg-neutral-950 border border-neutral-900 hover:border-neutral-800/80 rounded-2xl space-y-4 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 text-cyan-400 px-2.5 py-1 rounded-md">
                      {item.date}
                    </span>
                    {item.attendees && (
                      <span className="text-xs text-neutral-500">
                        참석자: {item.attendees}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2.5 py-1 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 text-xs rounded transition-all"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1 border border-neutral-800 hover:border-red-900/30 hover:border-red-500/20 text-neutral-400 hover:text-red-400 text-xs rounded transition-all"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white leading-relaxed">{item.title}</h3>
                  <div className="text-sm text-neutral-400 whitespace-pre-line leading-relaxed font-mono pl-2 border-l-2 border-neutral-800">
                    {item.content}
                  </div>
                </div>

                {item.decisions && (
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">주요 결정사항</h4>
                    <p className="text-sm text-neutral-300 whitespace-pre-line font-mono leading-relaxed">
                      {item.decisions}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
