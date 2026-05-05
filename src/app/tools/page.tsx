'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  Image,
  BarChart3,
  FileText,
  Dna,
  Calculator,
  BookOpen,
  Microscope,
  TestTubes,
  BrainCircuit,
  ArrowRight,
  Lock,
  Palette,
} from 'lucide-react';

const tools = [
  {
    icon: Palette,
    title: '自定义提示词出图',
    description: '编写自定义提示词，使用DALL-E 3生成高质量科研插图，支持保存和复用常用提示词',
    status: 'available' as const,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    href: '/custom-prompt',
  },
  {
    icon: Image,
    title: '科研绘图',
    description: '基于DALL-E 3生成高质量科研插图、机制图与数据可视化图表',
    status: 'available' as const,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: '统计分析',
    description: 'AI辅助选择统计方法、生成统计图表与三线表',
    status: 'available' as const,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: FileText,
    title: '论文写作',
    description: '智能论文润色、结构优化与参考文献管理',
    status: 'coming_soon' as const,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Dna,
    title: '生信分析',
    description: 'RNA-seq、WES、单细胞测序等生物信息学分析流程',
    status: 'coming_soon' as const,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
  },
  {
    icon: Calculator,
    title: '样本量计算',
    description: '根据研究设计自动计算所需样本量与统计功效',
    status: 'coming_soon' as const,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: BookOpen,
    title: '文献检索',
    description: '智能文献搜索、摘要提取与研究趋势分析',
    status: 'coming_soon' as const,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: Microscope,
    title: '实验设计',
    description: 'AI辅助实验方案设计、对照组设置与变量控制',
    status: 'planned' as const,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
  },
  {
    icon: TestTubes,
    title: '试剂计算器',
    description: '溶液配制、稀释计算与实验试剂用量计算',
    status: 'planned' as const,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: BrainCircuit,
    title: 'NSFC申请书',
    description: '国自然基金申请书智能撰写与格式优化',
    status: 'planned' as const,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
];

const statusConfig = {
  available: { label: '可用', variant: 'success' as const },
  coming_soon: { label: '即将上线', variant: 'warning' as const },
  planned: { label: '规划中', variant: 'default' as const },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              扩展工具
            </h1>
            <p className="text-gray-400">
              探索更多AI驱动的医学科研工具，覆盖从实验设计到论文发表的全流程
            </p>
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const status = statusConfig[tool.status];
              const isAvailable = tool.status === 'available';

              return (
                <Link
                  key={tool.title}
                  href={isAvailable && tool.href ? tool.href : '#'}
                  className={isAvailable && tool.href ? 'block' : undefined}
                >
                  <Card
                    variant="glass"
                    hover={isAvailable && !!tool.href}
                    padding="lg"
                    className={`relative ${!isAvailable ? 'opacity-75' : ''}`}
                  >
                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </div>

                    <div className={`inline-flex p-3 rounded-xl ${tool.bgColor} mb-4`}>
                      <Icon className={`h-6 w-6 ${tool.color}`} />
                    </div>

                    <h3 className="text-lg font-display font-semibold text-white mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {tool.description}
                    </p>

                    {isAvailable && tool.href ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-400"
                        rightIcon={<ArrowRight size={14} />}
                      >
                        立即使用
                      </Button>
                    ) : isAvailable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-400"
                        rightIcon={<ArrowRight size={14} />}
                      >
                        立即使用
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Lock size={12} />
                        {tool.status === 'coming_soon' ? '敬请期待' : '开发计划中'}
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
