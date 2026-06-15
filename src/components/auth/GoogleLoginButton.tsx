'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`구글 로그인 실패: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-neutral-900 border border-neutral-800 hover:border-cyan-500/30 hover:bg-neutral-800/50 text-neutral-200 hover:text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.554 0 2.969.577 4.053 1.526l3.056-3.056C19.1 2.68 15.86 1 12 1 5.925 1 1 5.925 1 12s4.925 11 11 11c5.93 0 10.87-4.28 11-10.285h-11.76z"
          />
        </svg>
      )}
      <span>{isLoading ? '구글 계정 연결 중...' : 'Google 계정으로 로그인'}</span>
    </button>
  );
}
