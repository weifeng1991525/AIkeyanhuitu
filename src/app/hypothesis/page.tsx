'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HypothesisGenerator from '@/components/generate/HypothesisGenerator';
import { HypothesisFormData } from '@/types';
import { toast } from 'react-hot-toast';

export default function HypothesisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    hypothesis: string;
    diagramPrompt: string;
    keyPoints: string[];
  } | null>(null);

  const handleSubmit = async (data: HypothesisFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate/hypothesis', {
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
      toast.success('假说图生成成功！');
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
              假说图生成
            </h1>
            <p className="text-gray-400">
              输入您的研究主题，AI将自动生成科学严谨的研究假说与可视化图示
            </p>
          </div>

          <HypothesisGenerator
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
