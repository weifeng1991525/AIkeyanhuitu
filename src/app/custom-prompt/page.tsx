'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { UserPrompt } from '@/types';
import { toast } from 'react-hot-toast';
import {
  Palette,
  Save,
  Trash2,
  Sparkles,
  Download,
  Image as ImageIcon,
  ChevronDown,
  Wand2,
  BookOpen,
  Loader2,
  X,
} from 'lucide-react';

type ImageSize = '1024x1024' | '1792x1024' | '1024x1792';
type ImageQuality = 'standard' | 'hd';

export default function CustomPromptPage() {
  // Prompt editor state
  const [promptText, setPromptText] = useState('');
  const [promptName, setPromptName] = useState('');
  const [promptDescription, setPromptDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Saved prompts state
  const [savedPrompts, setSavedPrompts] = useState<UserPrompt[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Image generation state
  const [selectedModel, setSelectedModel] = useState('dall-e-3');
  const [selectedSize, setSelectedSize] = useState<ImageSize>('1024x1024');
  const [selectedQuality, setSelectedQuality] = useState<ImageQuality>('hd');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string>('');

  // Fetch saved prompts on mount
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoadingPrompts(true);
      try {
        const response = await fetch('/api/custom-prompt');
        if (response.ok) {
          const data = await response.json();
          setSavedPrompts(data.prompts || []);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoadingPrompts(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleSavePrompt = useCallback(async () => {
    if (!promptText.trim()) {
      toast.error('请输入提示词内容');
      return;
    }
    if (!promptName.trim()) {
      toast.error('请输入提示词名称');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/custom-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: promptName.trim(),
          description: promptDescription.trim(),
          systemPrompt: promptText.trim(),
          category: 'GENERAL',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('提示词保存成功');
        setSavedPrompts((prev) => [data.prompt, ...prev]);
        setPromptName('');
        setPromptDescription('');
        setShowSaveForm(false);
      } else {
        const error = await response.json();
        toast.error(error.message || '保存失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [promptText, promptName, promptDescription]);

  const handleDeletePrompt = useCallback(async (id: string) => {
    setIsDeletingId(id);
    try {
      const response = await fetch('/api/custom-prompt', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success('提示词已删除');
        setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const error = await response.json();
        toast.error(error.message || '删除失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsDeletingId(null);
    }
  }, []);

  const handleLoadPrompt = useCallback((prompt: UserPrompt) => {
    setPromptText(prompt.systemPrompt);
    toast.success(`已加载提示词: ${prompt.name}`);
  }, []);

  const handleGenerateImage = useCallback(async () => {
    if (!promptText.trim()) {
      toast.error('请输入提示词内容');
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setRevisedPrompt('');

    try {
      const response = await fetch('/api/generate/custom-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText.trim(),
          size: selectedSize,
          quality: selectedQuality,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedImageUrl(data.url);
        setRevisedPrompt(data.revisedPrompt || '');
        toast.success('图片生成成功');
      } else {
        const error = await response.json();
        toast.error(error.message || '图片生成失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [promptText, selectedSize, selectedQuality]);

  const handleDownload = useCallback(() => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `medai-custom-${Date.now()}.png`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImageUrl]);

  const sizeOptions: { value: ImageSize; label: string }[] = [
    { value: '1024x1024', label: '1024 x 1024' },
    { value: '1792x1024', label: '1792 x 1024' },
    { value: '1024x1792', label: '1024 x 1792' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
              <Palette size={14} className="text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">自定义出图</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
              自定义提示词出图
            </h1>
            <p className="text-gray-400 max-w-2xl">
              编写自定义提示词，使用DALL-E 3生成高质量科研插图。保存常用提示词以便快速复用。
            </p>
          </div>

          {/* Main content - two panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Prompt Editor */}
            <div className="space-y-6">
              {/* Prompt textarea */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-teal-400" />
                    <h2 className="text-base font-display font-semibold text-white">
                      用户自定义提示词
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Save size={14} />}
                    onClick={() => setShowSaveForm(!showSaveForm)}
                  >
                    保存提示词
                  </Button>
                </div>

                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="请输入您的自定义提示词，例如：A detailed scientific illustration showing the mechanism of CRISPR-Cas9 gene editing, with labeled DNA strands, guide RNA, and Cas9 protein complex, clean vector style, white background, Nature journal quality..."
                  className="w-full h-48 bg-navy-500/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 hover:border-white/20 resize-none"
                />

                {/* Save form (collapsible) */}
                {showSaveForm && (
                  <div className="mt-4 p-4 bg-navy-500/30 border border-white/5 rounded-lg space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">保存到我的提示词</span>
                      <button
                        onClick={() => setShowSaveForm(false)}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={promptName}
                      onChange={(e) => setPromptName(e.target.value)}
                      placeholder="提示词名称"
                      className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                    />
                    <input
                      type="text"
                      value={promptDescription}
                      onChange={(e) => setPromptDescription(e.target.value)}
                      placeholder="描述（可选）"
                      className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSavePrompt}
                      isLoading={isSaving}
                      className="w-full"
                    >
                      保存
                    </Button>
                  </div>
                )}
              </Card>

              {/* Saved prompts list */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                  <h2 className="text-base font-display font-semibold text-white">
                    我的提示词
                  </h2>
                  <Badge variant="default" size="sm">
                    {savedPrompts.length}
                  </Badge>
                </div>

                {isLoadingPrompts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
                  </div>
                ) : savedPrompts.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">暂无保存的提示词</p>
                    <p className="text-xs text-gray-600 mt-1">
                      编写提示词后点击&quot;保存提示词&quot;按钮
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {savedPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="group flex items-start gap-3 p-3 bg-navy-500/30 border border-white/5 rounded-lg hover:border-teal-500/20 transition-all duration-200 cursor-pointer"
                        onClick={() => handleLoadPrompt(prompt)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-white truncate">
                              {prompt.name}
                            </h4>
                            <Badge variant="teal" size="sm">
                              {prompt.category}
                            </Badge>
                          </div>
                          {prompt.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {prompt.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {prompt.systemPrompt}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-gray-600">
                              使用 {prompt.usageCount} 次
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePrompt(prompt.id);
                          }}
                          disabled={isDeletingId === prompt.id}
                          className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="删除"
                        >
                          {isDeletingId === prompt.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Panel - Image Generation */}
            <div className="space-y-6">
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-purple-400" />
                  <h2 className="text-base font-display font-semibold text-white">
                    图片生成
                  </h2>
                </div>

                {/* Settings bar */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {/* Model selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      模型
                    </label>
                    <div className="relative">
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      >
                        <option value="dall-e-3">DALL-E 3</option>
                        <option value="dall-e-2">DALL-E 2</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Size selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      尺寸
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value as ImageSize)}
                        className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      >
                        {sizeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Quality selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      质量
                    </label>
                    <div className="relative">
                      <select
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value as ImageQuality)}
                        className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      >
                        <option value="hd">HD</option>
                        <option value="standard">Standard</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Generate button */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGenerateImage}
                  isLoading={isGenerating}
                  disabled={!promptText.trim() || isGenerating}
                  leftIcon={<Sparkles size={18} />}
                  className="w-full"
                >
                  {isGenerating ? '生成中...' : '生成图片'}
                </Button>
              </Card>

              {/* Generated image display */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-display font-semibold text-white">
                    生成结果
                  </h2>
                  {generatedImageUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download size={14} />}
                      onClick={handleDownload}
                    >
                      下载图片
                    </Button>
                  )}
                </div>

                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-teal-400" />
                    </div>
                    <p className="text-sm text-gray-400 mt-4">正在生成图片，请稍候...</p>
                    <p className="text-xs text-gray-600 mt-1">
                      DALL-E 3 通常需要 10-30 秒
                    </p>
                  </div>
                ) : generatedImageUrl ? (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-navy-500/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={generatedImageUrl}
                        alt="Generated image"
                        className="w-full h-auto"
                      />
                    </div>
                    {revisedPrompt && (
                      <div className="p-3 bg-navy-500/30 border border-white/5 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">DALL-E 3 修订后的提示词:</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {revisedPrompt}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <ImageIcon className="h-16 w-16 text-gray-700 mb-4" />
                    <p className="text-sm text-gray-500">暂无生成结果</p>
                    <p className="text-xs text-gray-600 mt-1">
                      在左侧输入提示词后点击&quot;生成图片&quot;
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
