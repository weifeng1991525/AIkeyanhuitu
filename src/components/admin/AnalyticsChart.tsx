'use client';

import React from 'react';
import { AnalyticsData } from '@/types';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsChartProps {
  data: AnalyticsData[];
  stats: {
    totalUsers: number;
    totalGenerations: number;
    totalRevenue: number;
    activeSubscriptions: number;
  };
}

const COLORS = ['#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

export default function AnalyticsChart({ data, stats }: AnalyticsChartProps) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: '总用户数',
            value: stats.totalUsers,
            change: '+12.5%',
            color: 'text-teal-400',
            bgColor: 'bg-teal-500/10',
          },
          {
            label: '总生成次数',
            value: stats.totalGenerations,
            change: '+23.1%',
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
          },
          {
            label: '总收入',
            value: `¥${(stats.totalRevenue / 100).toLocaleString()}`,
            change: '+8.3%',
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
          },
          {
            label: '活跃订阅',
            value: stats.activeSubscriptions,
            change: '+5.2%',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
          },
        ].map((stat) => (
          <Card key={stat.label} variant="glass" padding="md">
            <CardContent>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color} font-display`}>
                {stat.value}
              </p>
              <p className="text-xs text-emerald-400 mt-1">{stat.change} vs 上月</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generation Trend Chart */}
      <Card variant="glass" padding="lg">
        <CardHeader>
          <CardTitle>生成趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1628',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalGenerations"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGenerations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Generation Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="lg">
          <CardHeader>
            <CardTitle>生成类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1628',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="hypothesisCount" stackId="a" fill="#0EA5E9" name="假说图" />
                  <Bar dataKey="roadmapCount" stackId="a" fill="#F59E0B" name="路线图" />
                  <Bar dataKey="imageCount" stackId="a" fill="#10B981" name="图像" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg">
          <CardHeader>
            <CardTitle>收入趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1628',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
