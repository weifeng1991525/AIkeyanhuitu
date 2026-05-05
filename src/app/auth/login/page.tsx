'use client';

import React from 'react';
import Link from 'next/link';
import WeChatLogin from '@/components/auth/WeChatLogin';
import { Microscope } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-500 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center gap-2.5 mb-4">
            <Microscope className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-display font-bold text-white">
              MedAI Pro
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            登录您的医学科研AI平台账户
          </p>
        </div>

        {/* WeChat QR Code Login - Only login method */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-glass rounded-xl p-8">
          <WeChatLogin />
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/home"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            &larr; 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
