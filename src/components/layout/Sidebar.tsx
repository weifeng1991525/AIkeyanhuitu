'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  GitBranch,
  Map,
  Wrench,
  Crown,
  HelpCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/home', label: '首页', icon: Home },
  { href: '/hypothesis', label: '假说图生成', icon: GitBranch },
  { href: '/roadmap', label: '技术路线图', icon: Map },
  { href: '/tools', label: '扩展工具', icon: Wrench },
];

const bottomLinks = [
  { href: '/membership', label: '会员中心', icon: Crown },
  { href: '#help', label: '帮助中心', icon: HelpCircle },
  { href: '#feedback', label: '意见反馈', icon: MessageSquare },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 z-30 bg-navy-500/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-navy-400 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-300 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Main links */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            主要功能
          </p>
        )}
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'text-teal-400 bg-teal-500/10 shadow-neon'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon
                size={18}
                className={cn(
                  'transition-colors flex-shrink-0',
                  isActive ? 'text-teal-400' : 'text-gray-500 group-hover:text-gray-300'
                )}
              />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom links */}
      <div className="py-4 px-2 border-t border-white/5 space-y-1">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
