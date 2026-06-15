'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PendingApprovalPage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Poll the profile status periodically to see if user got approved
    const interval = setInterval(async () => {
      if (user) {
        await refreshProfile();
      }
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, [user, refreshProfile]);

  useEffect(() => {
    // If approved, automatically redirect to home
    if (profile?.is_approved) {
      router.push('/');
    }
  }, [profile, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-neutral-950 border border-cyan-500/20 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/5 blur-3xl rounded-full"></div>

        <div className="flex justify-center relative">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 text-3xl font-serif animate-pulse">
            !
          </div>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight text-cyan-400">계정 승인 대기 중</h2>
        
        <div className="space-y-2 text-sm text-neutral-400">
          <p>
            안녕하세요, <span className="text-cyan-200 font-semibold">{user?.email}</span> 님.
          </p>
          <p className="leading-relaxed">
            원내 인트라넷 보안 정책에 따라, 신규 등록된 계정은 원장님 또는 시스템 관리자의 승인을 받은 후 대시보드 이용이 가능합니다.
          </p>
        </div>

        <div className="pt-6 border-t border-neutral-900 space-y-4">
          <p className="text-xs text-neutral-500 leading-normal">
            본명과 소속 부서를 관리자에게 전달하여 승인을 요청해 주세요.<br />
            (승인이 완료되면 이 페이지에서 자동으로 대시보드로 이동합니다.)
          </p>
          
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-all text-sm font-medium"
          >
            다른 계정으로 로그인 (로그아웃)
          </button>
        </div>
      </div>
    </div>
  );
}
