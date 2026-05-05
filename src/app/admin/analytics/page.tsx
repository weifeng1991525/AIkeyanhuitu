'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsData } from '@/types';
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import { toast } from 'react-hot-toast';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGenerations: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const result = await response.json();
        setData(result.data || []);
        setStats(result.stats || {
          totalUsers: 0,
          totalGenerations: 0,
          totalRevenue: 0,
          activeSubscriptions: 0,
        });
      }
    } catch {
      // Use mock data for demo
      const mockData: AnalyticsData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000)
          .toISOString()
          .split('T')[0],
        totalUsers: 800 + Math.floor(i * 8 + Math.random() * 20),
        newUsers: Math.floor(Math.random() * 30) + 5,
        totalGenerations: 300 + Math.floor(i * 15 + Math.random() * 50),
        hypothesisCount: Math.floor(Math.random() * 20) + 10,
        roadmapCount: Math.floor(Math.random() * 10) + 5,
        imageCount: Math.floor(Math.random() * 15) + 8,
        revenue: Math.floor(Math.random() * 50000) + 30000,
        activeSubscriptions: 250 + Math.floor(i * 3 + Math.random() * 10),
      }));
      setData(mockData);
      setStats({
        totalUsers: 1024,
        totalGenerations: 48320,
        totalRevenue: 128500000,
        activeSubscriptions: 342,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          统计分析
        </h1>
        <p className="text-sm text-gray-500">
          平台运营数据与趋势分析
        </p>
      </div>

      <AnalyticsChart data={data} stats={stats} />
    </div>
  );
}
