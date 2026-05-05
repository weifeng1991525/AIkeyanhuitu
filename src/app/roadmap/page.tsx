'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoadmapGenerator from '@/components/generate/RoadmapGenerator';
import { RoadmapFormData } from '@/types';
import { toast } from 'react-hot-toast';

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    roadmap: string;
    phases: Array<{ phase: string; tasks: string[]; duration: string }>;
  } | null>(null);

  const handleSubmit = async (data: RoadmapFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '生成失败');
      }

      const data_ = await response.json();
      setResult(data_);
      toast.success('技术路线图生成成功！');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '生成失败，请重试'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              技术路线图
            </h1>
            <p className="text-gray-400">
              AI辅助规划科研项目的技术路线、里程碑与时间节点
            </p>
          </div>

          <RoadmapGenerator
            onSubmit={handleSubmit}
            isLoading={isLoading}
            result={result}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
