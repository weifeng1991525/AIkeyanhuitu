'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  Users,
  Zap,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalGenerations: number;
  generationsToday: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeSubscriptions: number;
  premiumConversionRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch {
        // Use fallback data
        setStats({
          totalUsers: 1024,
          activeUsersToday: 156,
          totalGenerations: 48320,
          generationsToday: 892,
          totalRevenue: 1285000,
          revenueThisMonth: 156000,
          activeSubscriptions: 342,
          premiumConversionRate: 33.4,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: '总用户数',
      value: stats?.totalUsers || 0,
      change: '+12.5%',
      isUp: true,
      icon: Users,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
    },
    {
      label: '今日活跃',
      value: stats?.activeUsersToday || 0,
      change: '+8.2%',
      isUp: true,
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: '总生成次数',
      value: stats?.totalGenerations || 0,
      change: '+23.1%',
      isUp: true,
      icon: Zap,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: '本月收入',
      value: `¥${((stats?.revenueThisMonth || 0) / 100).toLocaleString()}`,
      change: '+15.3%',
      isUp: true,
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          管理仪表盘
        </h1>
        <p className="text-sm text-gray-500">
          MedAI Pro 平台运营数据概览
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="glass" padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white font-display">
                    {typeof stat.value === 'number'
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {stat.isUp ? (
                  <ArrowUpRight size={14} className="text-emerald-400" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-400" />
                )}
                <span
                  className={`text-xs ${
                    stat.isUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-gray-600">vs 上月</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">活跃订阅</p>
              <p className="text-xl font-bold text-white">
                {stats?.activeSubscriptions || 0}
              </p>
            </div>
            <Badge variant="success" size="sm">
              活跃
            </Badge>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">付费转化率</p>
              <p className="text-xl font-bold text-white">
                {stats?.premiumConversionRate || 0}%
              </p>
            </div>
            <Badge variant="teal" size="sm">
              转化
            </Badge>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">今日生成</p>
              <p className="text-xl font-bold text-white">
                {stats?.generationsToday || 0}
              </p>
            </div>
            <Badge variant="amber" size="sm">
              今日
            </Badge>
          </div>
        </Card>
      </div>

      {/* Recent activity placeholder */}
      <Card variant="glass" padding="lg">
        <h2 className="text-lg font-display font-semibold text-white mb-4">
          最近活动
        </h2>
        <div className="space-y-3">
          {[
            { action: '新用户注册', detail: 'user_***@example.com', time: '2分钟前' },
            { action: '假说图生成', detail: 'circRNA在肝癌中的调控机制', time: '5分钟前' },
            { action: '订阅升级', detail: 'BASIC -> PRO', time: '12分钟前' },
            { action: '技术路线图生成', detail: '肿瘤免疫治疗研究', time: '18分钟前' },
            { action: '新用户注册', detail: 'user_***@hospital.cn', time: '25分钟前' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full" />
                <div>
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.detail}</p>
                </div>
              </div>
              <span className="text-xs text-gray-600">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
