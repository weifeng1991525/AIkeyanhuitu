'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WeChatLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function WeChatLogin({ onSuccess, onError }: WeChatLoginProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [loginState, setLoginState] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'scanning' | 'success' | 'expired' | 'error'>('loading');
  const router = useRouter();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const maxPolls = 60; // 3 seconds * 60 = 3 minutes max

  const buildQrUrl = useCallback((state: string) => {
    const appId = process.env.NEXT_PUBLIC_WECHAT_APP_ID || '';
    const redirectUri = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/api/auth/wechat/callback`
    );
    return `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
  }, []);

  const initQrCode = useCallback(async () => {
    setIsLoading(true);
    setStatus('loading');
    setPollCount(0);

    const state = `medai_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    setLoginState(state);

    try {
      const response = await fetch(`/api/auth/wechat/login?state=${state}`);
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          setQrUrl(data.url);
        } else {
          // Fallback: build URL from env vars
          setQrUrl(buildQrUrl(state));
        }
      } else {
        // API failed, build URL directly from env vars
        setQrUrl(buildQrUrl(state));
      }
    } catch {
      // Network error, build URL directly from env vars
      setQrUrl(buildQrUrl(state));
    } finally {
      setIsLoading(false);
      setStatus('scanning');
    }
  }, [buildQrUrl]);

  // Initialize QR code on mount
  useEffect(() => {
    initQrCode();
  }, [initQrCode]);

  // Polling mechanism to check login status
  useEffect(() => {
    if (status !== 'scanning' || !loginState) return;

    setIsPolling(true);
    pollingRef.current = setInterval(async () => {
      setPollCount((prev) => {
        const next = prev + 1;
        if (next >= maxPolls) {
          // QR code expired after 3 minutes
          setStatus('expired');
          setIsPolling(false);
          if (pollingRef.current) clearInterval(pollingRef.current);
          return next;
        }
        return next;
      });

      try {
        const response = await fetch(`/api/auth/session`);
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // Login successful - user scanned and confirmed
            setStatus('success');
            setIsPolling(false);
            if (pollingRef.current) clearInterval(pollingRef.current);
            onSuccess?.();
            // Redirect to home after a brief success animation
            setTimeout(() => {
              router.push('/home');
            }, 1500);
          }
        }
      } catch {
        // Silently continue polling
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [status, loginState, onSuccess, router]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleRefresh = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    initQrCode();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-2xl mb-3">
          <MessageCircle className="h-7 w-7 text-green-500" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-1.5">
          微信扫码登录
        </h2>
        <p className="text-sm text-gray-500">
          请使用微信扫描下方二维码完成登录
        </p>
      </div>

      {/* QR Code Area */}
      <div className="relative bg-white rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
              <span className="text-sm text-gray-500">正在加载二维码...</span>
            </div>
          </div>
        ) : status === 'success' ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <span className="text-sm font-medium text-green-600">登录成功</span>
              <span className="text-xs text-gray-400">正在跳转...</span>
            </div>
          </div>
        ) : status === 'expired' ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">二维码已过期</span>
              <button
                onClick={handleRefresh}
                className="mt-1 px-4 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                点击刷新
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* WeChat QR Code iframe */}
            <iframe
              src={qrUrl}
              sandbox="allow-scripts allow-same-origin allow-top-navigation"
              style={{
                width: '300px',
                height: '400px',
                border: 'none',
                display: 'block',
                margin: '0 auto',
              }}
              title="微信扫码登录"
            />

            {/* Polling indicator overlay */}
            {isPolling && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80">
                    等待扫码{pollCount > 0 ? ` (${Math.min(pollCount * 3, 180)}s)` : ''}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Terms text */}
      <p className="text-xs text-gray-600 text-center mt-4 leading-relaxed">
        登录即表示您同意
        <a href="#" className="text-teal-500 hover:text-teal-400 transition-colors">
          《服务条款》
        </a>
        和
        <a href="#" className="text-teal-500 hover:text-teal-400 transition-colors">
          《隐私政策》
        </a>
      </p>
    </div>
  );
}
