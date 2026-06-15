'use client';

import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-neutral-950/80 border border-neutral-900 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-400 to-blue-200 font-serif">
          Medical Glow
        </h1>
        <p className="text-neutral-500 text-xs tracking-widest uppercase">
          Operations Dashboard 2026
        </p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <p className="text-neutral-300 text-sm">
            원내 직원을 위한 전용 인트라넷입니다.
          </p>
          <p className="text-neutral-500 text-xs mt-1">
            구글 워크스페이스 계정으로 로그인을 진행해 주세요.
          </p>
        </div>

        {error === 'auth_failed' && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            인증 처리에 실패하였습니다. 관리자에게 문의하세요.
          </div>
        )}

        <GoogleLoginButton />
      </div>

      <div className="pt-6 border-t border-neutral-900 text-center">
        <p className="text-[10px] text-neutral-600">
          © {new Date().getFullYear()} Medical Glow. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <Suspense fallback={
        <div className="w-full max-w-md p-8 bg-neutral-950/80 border border-neutral-900 rounded-3xl shadow-2xl text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500 text-sm">페이지 로드 중...</p>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </main>
  );
}
