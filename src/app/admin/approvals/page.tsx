'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, Profile, UserRole } from '@/context/AuthContext';
import { getPendingUsers, approveUser, getApprovedStaff, updateUserProfile } from '@/services/admin';
import Link from 'next/link';

export default function AdminApprovalsPage() {
  const { profile } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<Profile[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: UserRole }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Separate function for triggering updates from action handlers (outside of useEffect)
  const triggerReload = useCallback(async () => {
    try {
      const [pending, approved] = await Promise.all([
        getPendingUsers(),
        getApprovedStaff()
      ]);
      setPendingUsers(pending);
      setApprovedUsers(approved);

      const initialRoles: { [key: string]: UserRole } = {};
      pending.forEach(u => {
        initialRoles[u.id] = u.role || 'desk';
      });
      setSelectedRoles(initialRoles);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use clean mounting effect to fetch initial data, preventing react-hooks/set-state-in-effect issues.
  useEffect(() => {
    let active = true;

    const fetchInitialData = async () => {
      try {
        const [pending, approved] = await Promise.all([
          getPendingUsers(),
          getApprovedStaff()
        ]);
        if (!active) return;
        setPendingUsers(pending);
        setApprovedUsers(approved);

        const initialRoles: { [key: string]: UserRole } = {};
        pending.forEach(u => {
          initialRoles[u.id] = u.role || 'desk';
        });
        setSelectedRoles(initialRoles);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      active = false;
    };
  }, []);

  const handleRoleChange = (userId: string, role: UserRole) => {
    setSelectedRoles(prev => ({
      ...prev,
      [userId]: role
    }));
  };

  const handleApprove = async (userId: string) => {
    const role = selectedRoles[userId] || 'desk';
    setActionLoading(userId);
    try {
      await approveUser(userId, role);
      setIsLoading(true);
      await triggerReload();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`승인 실패: ${msg}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    setActionLoading(userId);
    try {
      await updateUserProfile(userId, { role: newRole });
      setIsLoading(true);
      await triggerReload();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`권한 변경 실패: ${msg}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (userId: string) => {
    if (!confirm('정말로 이 직원의 승인을 취소하고 접근 권한을 박탈하시겠습니까?')) return;
    setActionLoading(userId);
    try {
      await updateUserProfile(userId, { is_approved: false });
      setIsLoading(true);
      await triggerReload();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`권한 취소 실패: ${msg}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-black text-white font-sans">
      <header className="border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-400 to-blue-200 font-serif">
              Medical Glow
            </Link>
            <span className="text-[10px] uppercase tracking-wider text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Admin Page
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">직원 승인 및 권한 관리</h2>
          <p className="text-neutral-400 text-sm">신규 가입한 직원의 접근을 활성화하고 업무별 권한을 할당합니다.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-500 text-xs">직원 목록을 로딩하는 중...</p>
          </div>
        ) : (
          <>
            {/* 1. 승인 대기 직원 섹션 */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold tracking-wider text-cyan-400 flex items-center gap-2">
                <span>승인 대기 중인 직원</span>
                <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                  {pendingUsers.length}명
                </span>
              </h3>

              {pendingUsers.length === 0 ? (
                <div className="p-10 border border-dashed border-neutral-800 rounded-2xl text-center text-neutral-500 text-sm">
                  승인 대기 중인 새로운 가입자가 없습니다.
                </div>
              ) : (
                <div className="border border-neutral-900 rounded-2xl overflow-hidden bg-neutral-950/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                      <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase tracking-wider border-b border-neutral-900">
                        <tr>
                          <th className="px-6 py-4">이름</th>
                          <th className="px-6 py-4">이메일</th>
                          <th className="px-6 py-4">가입일</th>
                          <th className="px-6 py-4">권한(역할군) 설정</th>
                          <th className="px-6 py-4 text-right">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900">
                        {pendingUsers.map(u => (
                          <tr key={u.id} className="hover:bg-neutral-900/30">
                            <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                            <td className="px-6 py-4 text-neutral-400">{u.email}</td>
                            <td className="px-6 py-4 text-neutral-500 text-xs">
                              {new Date(u.created_at).toLocaleDateString('ko-KR')}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={selectedRoles[u.id] || 'desk'}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                className="bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-cyan-500 outline-none"
                              >
                                <option value="desk">데스크 (desk)</option>
                                <option value="nurse">간호팀 (nurse)</option>
                                <option value="marketing">홍보/마케팅 (marketing)</option>
                                <option value="admin">관리자 (admin)</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleApprove(u.id)}
                                disabled={actionLoading === u.id}
                                className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 text-black font-semibold text-xs rounded-lg transition-colors"
                              >
                                {actionLoading === u.id ? '처리 중' : '승인 완료'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            {/* 2. 승인된 직원 섹션 */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold tracking-wider text-neutral-300 flex items-center gap-2">
                <span>승인 완료된 직원</span>
                <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                  {approvedUsers.length}명
                </span>
              </h3>

              {approvedUsers.length === 0 ? (
                <div className="p-10 border border-neutral-900 rounded-2xl text-center text-neutral-500 text-sm">
                  승인 완료된 직원이 없습니다.
                </div>
              ) : (
                <div className="border border-neutral-900 rounded-2xl overflow-hidden bg-neutral-950/20">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                      <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase tracking-wider border-b border-neutral-900">
                        <tr>
                          <th className="px-6 py-4">이름</th>
                          <th className="px-6 py-4">이메일</th>
                          <th className="px-6 py-4">역할</th>
                          <th className="px-6 py-4 text-right">역할 수정 / 권한 취소</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900">
                        {approvedUsers.map(u => (
                          <tr key={u.id} className="hover:bg-neutral-900/10">
                            <td className="px-6 py-4 font-semibold text-white">
                              {u.name}
                              {u.id === profile?.id && <span className="ml-2 text-[10px] text-cyan-500 font-normal">(본인)</span>}
                            </td>
                            <td className="px-6 py-4 text-neutral-400">{u.email}</td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                disabled={u.id === profile?.id}
                                onChange={(e) => handleRoleUpdate(u.id, e.target.value as UserRole)}
                                className="bg-black border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-cyan-500 outline-none disabled:opacity-50"
                              >
                                <option value="desk">데스크 (desk)</option>
                                <option value="nurse">간호팀 (nurse)</option>
                                <option value="marketing">홍보/마케팅 (marketing)</option>
                                <option value="admin">관리자 (admin)</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleRevoke(u.id)}
                                disabled={u.id === profile?.id || actionLoading === u.id}
                                className="px-3.5 py-1.5 bg-neutral-900 hover:bg-red-900/30 hover:border-red-500/30 border border-neutral-800 text-neutral-400 hover:text-red-400 disabled:opacity-50 text-xs rounded-lg transition-all"
                              >
                                {actionLoading === u.id ? '처리 중' : '승인 취소'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
