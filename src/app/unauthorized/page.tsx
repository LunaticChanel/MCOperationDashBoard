'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-neutral-950 border border-neutral-900 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-3xl font-bold">
            !
          </div>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight text-red-400">접근 권한 제한됨</h2>
        
        <div className="space-y-2 text-sm text-neutral-400">
          <p>
            요청하신 페이지에 접근할 수 있는 권한이 없습니다.
          </p>
          <p className="leading-relaxed text-xs">
            해당 영역은 특정 역할(부서)의 권한이 할당된 사용자만 진입할 수 있습니다.<br />
            권한 조정이 필요한 경우 대표원장 또는 시스템 관리자에게 요청하세요.
          </p>
        </div>

        <div className="pt-6 border-t border-neutral-900 flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-all text-sm font-medium"
          >
            이전 페이지로
          </button>
          <Link
            href="/"
            className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-all text-sm font-semibold flex items-center justify-center"
          >
            대시보드 홈
          </Link>
        </div>
      </div>
    </div>
  );
}
