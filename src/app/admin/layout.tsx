'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === 'ADMIN') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-500 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
            <div
              className="absolute inset-0 h-12 w-12 rounded-full border-2 border-amber-500/10 border-b-amber-500/50 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
          </div>
          <p className="text-sm text-gray-400 animate-pulse">正在验证权限...</p>
        </div>
      </div>
    );
  }

  // No access
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="p-5 bg-red-500/10 rounded-2xl inline-flex mb-6">
            <AlertTriangle className="h-14 w-14 text-red-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-3">
            无权限访问
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            您没有管理员权限，无法访问此页面。如需获取管理权限，请联系系统管理员。
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  // Admin layout
  return (
    <div className="min-h-screen bg-navy-500 flex">
      {/* Admin Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <AdminSidebar />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Admin Header Bar */}
        <header className="sticky top-0 z-30 bg-navy-500/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                <span className="text-base font-display font-bold text-white tracking-tight">
                  MedAI Pro
                </span>
              </div>
              <span className="text-gray-600">/</span>
              <span className="text-sm font-medium text-gray-400">
                管理后台
              </span>
            </div>

            {/* Right: Back to frontend */}
            <Link
              href="/home"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <ArrowLeft size={16} />
              返回前台
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
