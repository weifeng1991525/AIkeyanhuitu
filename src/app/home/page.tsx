'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  Microscope,
  GitBranch,
  Map,
  Image,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Users,
  ChevronRight,
  Brain,
  Dna,
  FlaskConical,
  BarChart3,
  FileText,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: '假说图生成',
    description: '输入研究主题，AI自动生成科学严谨的研究假说与可视化图示',
    href: '/hypothesis',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: Map,
    title: '技术路线图',
    description: '智能规划科研项目的技术路线、里程碑与时间节点',
    href: '/roadmap',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Image,
    title: '科研绘图',
    description: '基于DALL-E生成高质量科研插图、机制图与数据可视化',
    href: '/tools',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: '数据分析',
    description: 'AI辅助统计分析、图表生成与研究结果解读',
    href: '/tools',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: FileText,
    title: '论文辅助',
    description: '智能论文写作、文献管理与投稿建议',
    href: '/tools',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Dna,
    title: '生信分析',
    description: 'RNA-seq、单细胞测序等生物信息学分析流程',
    href: '/tools',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
  },
];

const stats = [
  { value: '10,000+', label: '活跃研究者' },
  { value: '50,000+', label: '生成假说' },
  { value: '98.5%', label: '用户满意度' },
  { value: '200+', label: '合作期刊' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full mb-8 animate-fade-in">
              <Sparkles size={14} className="text-teal-400" />
              <span className="text-sm text-teal-400 font-medium">
                Powered by GPT-4 & DALL-E 3
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6 animate-fade-up">
              让AI成为您的
              <br />
              <span className="gradient-text">科研伙伴</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
              基于先进AI技术，为医学研究者提供假说构建、路线规划、
              科研绘图等一站式智能科研辅助服务
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/hypothesis">
                <Button size="lg" leftIcon={<FlaskConical size={18} />}>
                  开始使用
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
              <Link href="/membership">
                <Button variant="outline" size="lg">
                  查看会员方案
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-display font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-navy-500/50">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="teal" size="md" className="mb-4">
              核心功能
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              全方位科研辅助工具
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              从课题构思到论文发表，AI全程陪伴您的科研旅程
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card variant="glass" hover padding="lg" className="h-full">
                    <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm text-teal-400 font-medium">
                      了解更多
                      <ChevronRight size={14} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="amber" size="md" className="mb-4">
              使用流程
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              三步完成科研图示生成
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '输入研究主题',
                description: '描述您的研究方向、疾病领域和关键变量',
                icon: Brain,
              },
              {
                step: '02',
                title: 'AI智能生成',
                description: 'GPT-4分析文献并生成科学严谨的研究假说',
                icon: Sparkles,
              },
              {
                step: '03',
                title: '导出高质量图示',
                description: 'DALL-E 3生成可发表级别的科研插图',
                icon: Image,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative text-center">
                  <div className="text-6xl font-display font-bold text-white/5 absolute -top-4 left-1/2 -translate-x-1/2">
                    {item.step}
                  </div>
                  <div className="relative">
                    <div className="inline-flex p-4 bg-navy-400 rounded-2xl mb-6 border border-white/5">
                      <Icon className="h-8 w-8 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-navy-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: '数据安全',
                description: '端到端加密，研究数据严格保密，符合HIPAA标准',
              },
              {
                icon: Zap,
                title: '极速生成',
                description: '平均30秒内完成假说生成，大幅提升科研效率',
              },
              {
                icon: Users,
                title: '专家团队',
                description: '由资深医学研究者与AI工程师共同打造',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} variant="bordered" padding="lg" className="text-center">
                  <div className="inline-flex p-3 bg-teal-500/10 rounded-xl mb-4">
                    <Icon className="h-6 w-6 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card variant="gradient" padding="lg" className="animated-border">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              准备好提升您的科研效率了吗？
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              加入10,000+医学研究者的行列，让AI助力您的下一个突破性发现
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/login">
                <Button size="lg" leftIcon={<Star size={18} />}>
                  免费注册
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
