'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
  Zap,
  BarChart3,
  Users,
  ShoppingBag,
  ArrowLeft,
  Shield,
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/prompts', label: '提示词管理', icon: MessageSquare },
  { href: '/admin/skills', label: 'Skill管理', icon: Zap },
  { href: '/admin/analytics', label: '统计分析', icon: BarChart3 },
  { href: '/admin/users', label: '会员管理', icon: Users },
  { href: '/admin/orders', label: '充值订单', icon: ShoppingBag },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-navy-500/80 border-r border-white/5 flex flex-col">
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-semibold text-white font-display">
            管理后台
          </h2>
        </div>
        <p className="text-xs text-gray-500">MedAI Pro Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} className={cn(isActive ? 'text-amber-400' : 'text-gray-500')} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="px-3 py-4 border-t border-white/5">
        <Link
          href="/home"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={16} />
          返回前台
        </Link>
      </div>
    </aside>
  );
}
