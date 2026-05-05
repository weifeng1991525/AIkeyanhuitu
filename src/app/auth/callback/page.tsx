'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setError('缺少授权码，请重新登录');
      return;
    }

    const handleCallback = async () => {
      try {
        const response = await fetch('/api/auth/wechat/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        if (response.ok) {
          router.push('/home');
        } else {
          const data = await response.json();
          setError(data.message || '登录失败，请重试');
        }
      } catch {
        setError('网络错误，请重试');
      }
    };

    handleCallback();
  }, [code, state, router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2">
            登录失败
          </h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <a
            href="/auth/login"
            className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            重新登录
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-500">
      <Loading size="lg" text="正在完成微信登录..." />
    </div>
  );
}
