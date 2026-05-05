'use client';

import React, { useState } from 'react';
import { Prompt } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Code,
  Eye,
} from 'lucide-react';

interface PromptEditorProps {
  prompts: Prompt[];
  onSave: (prompt: Partial<Prompt>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function PromptEditor({
  prompts,
  onSave,
  onDelete,
  isLoading = false,
}: PromptEditorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Partial<Prompt> | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleNew = () => {
    setEditingPrompt({
      name: '',
      description: '',
      category: 'HYPOTHESIS',
      systemPrompt: '',
      userPromptTemplate: '',
      variables: [],
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
      isPublished: false,
    });
    setPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt({ ...prompt });
    setPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingPrompt) return;
    await onSave(editingPrompt);
    setIsModalOpen(false);
    setEditingPrompt(null);
  };

  const handleChange = (field: string, value: unknown) => {
    if (!editingPrompt) return;
    setEditingPrompt({ ...editingPrompt, [field]: value });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold text-white">提示词管理</h2>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={handleNew}>
          新建提示词
        </Button>
      </div>

      {/* Prompt list */}
      <div className="space-y-3">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="flex items-center justify-between p-4 bg-navy-500/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white truncate">
                  {prompt.name}
                </h3>
                <Badge
                  variant={prompt.isPublished ? 'success' : 'default'}
                  size="sm"
                >
                  {prompt.isPublished ? '已发布' : '草稿'}
                </Badge>
                <Badge variant="info" size="sm">
                  {prompt.category}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 truncate">{prompt.description}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleEdit(prompt)}
                className="p-1.5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPrompt?.id ? '编辑提示词' : '新建提示词'}
        size="xl"
      >
        {editingPrompt && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setPreviewMode(false)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  !previewMode
                    ? 'bg-teal-500/10 text-teal-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Code size={12} className="inline mr-1" />
                编辑
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  previewMode
                    ? 'bg-teal-500/10 text-teal-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Eye size={12} className="inline mr-1" />
                预览
              </button>
            </div>

            {!previewMode ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="名称"
                    value={editingPrompt.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  <Select
                    label="分类"
                    value={editingPrompt.category || 'HYPOTHESIS'}
                    onChange={(e) => handleChange('category', e.target.value)}
                    options={[
                      { value: 'HYPOTHESIS', label: '假说生成' },
                      { value: 'ROADMAP', label: '路线图' },
                      { value: 'IMAGE', label: '图像生成' },
                      { value: 'GENERAL', label: '通用' },
                    ]}
                  />
                </div>

                <Input
                  label="描述"
                  value={editingPrompt.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    System Prompt
                  </label>
                  <textarea
                    value={editingPrompt.systemPrompt || ''}
                    onChange={(e) => handleChange('systemPrompt', e.target.value)}
                    rows={6}
                    className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    User Prompt Template
                  </label>
                  <textarea
                    value={editingPrompt.userPromptTemplate || ''}
                    onChange={(e) =>
                      handleChange('userPromptTemplate', e.target.value)
                    }
                    rows={4}
                    className="w-full bg-navy-500/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={String(editingPrompt.temperature || 0.7)}
                    onChange={(e) =>
                      handleChange('temperature', parseFloat(e.target.value))
                    }
                  />
                  <Input
                    label="Max Tokens"
                    type="number"
                    value={String(editingPrompt.maxTokens || 2000)}
                    onChange={(e) =>
                      handleChange('maxTokens', parseInt(e.target.value))
                    }
                  />
                  <Select
                    label="模型"
                    value={editingPrompt.model || 'gpt-4-turbo-preview'}
                    onChange={(e) => handleChange('model', e.target.value)}
                    options={[
                      { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
                      { value: 'gpt-4', label: 'GPT-4' },
                      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                    ]}
                  />
                </div>
              </>
            ) : (
              <div className="bg-navy-500/50 rounded-lg p-6 border border-white/5">
                <h3 className="text-white font-semibold mb-2">
                  {editingPrompt.name || '未命名提示词'}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {editingPrompt.description || '无描述'}
                </p>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      System Prompt
                    </span>
                    <pre className="mt-1 text-xs text-gray-300 whitespace-pre-wrap font-mono bg-navy-600/50 p-3 rounded">
                      {editingPrompt.systemPrompt || '(empty)'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      User Template
                    </span>
                    <pre className="mt-1 text-xs text-gray-300 whitespace-pre-wrap font-mono bg-navy-600/50 p-3 rounded">
                      {editingPrompt.userPromptTemplate || '(empty)'}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button
                isLoading={isLoading}
                onClick={handleSave}
                leftIcon={<Save size={14} />}
              >
                保存
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
