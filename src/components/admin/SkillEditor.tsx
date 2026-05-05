'use client';

import React, { useState } from 'react';
import { Skill } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, Save, GripVertical } from 'lucide-react';

interface SkillEditorProps {
  skills: Skill[];
  prompts: Array<{ id: string; name: string }>;
  onSave: (skill: Partial<Skill>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function SkillEditor({
  skills,
  prompts,
  onSave,
  onDelete,
  isLoading = false,
}: SkillEditorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  const handleNew = () => {
    setEditingSkill({
      name: '',
      description: '',
      category: '',
      icon: 'Zap',
      promptIds: [],
      isPublished: false,
      sortOrder: skills.length,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingSkill) return;
    await onSave(editingSkill);
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const togglePrompt = (promptId: string) => {
    if (!editingSkill) return;
    const currentIds = editingSkill.promptIds || [];
    const newIds = currentIds.includes(promptId)
      ? currentIds.filter((id) => id !== promptId)
      : [...currentIds, promptId];
    setEditingSkill({ ...editingSkill, promptIds: newIds });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold text-white">Skill管理</h2>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={handleNew}>
          新建Skill
        </Button>
      </div>

      {/* Skills list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 bg-navy-500/30 rounded-xl border border-white/5 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-gray-600 cursor-grab" />
                <div className="p-1.5 bg-teal-500/10 rounded-lg">
                  <span className="text-lg">{skill.icon}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(skill)}
                  className="p-1 text-gray-400 hover:text-teal-400 rounded transition-colors"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => onDelete(skill.id)}
                  className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{skill.name}</h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
              {skill.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant={skill.isPublished ? 'success' : 'default'}
                size="sm"
              >
                {skill.isPublished ? '已发布' : '草稿'}
              </Badge>
              <Badge variant="info" size="sm">
                {skill.promptIds.length} 提示词
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill?.id ? '编辑Skill' : '新建Skill'}
        size="lg"
      >
        {editingSkill && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="名称"
                value={editingSkill.name || ''}
                onChange={(e) =>
                  setEditingSkill({ ...editingSkill, name: e.target.value })
                }
              />
              <Input
                label="图标 (Emoji)"
                value={editingSkill.icon || ''}
                onChange={(e) =>
                  setEditingSkill({ ...editingSkill, icon: e.target.value })
                }
              />
            </div>

            <Input
              label="分类"
              value={editingSkill.category || ''}
              onChange={(e) =>
                setEditingSkill({ ...editingSkill, category: e.target.value })
              }
              placeholder="例如：生信分析、统计分析、论文写作"
            />

            <Input
              label="描述"
              value={editingSkill.description || ''}
              onChange={(e) =>
                setEditingSkill({
                  ...editingSkill,
                  description: e.target.value,
                })
              }
            />

            {/* Prompt selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                关联提示词
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1 bg-navy-500/50 rounded-lg p-3 border border-white/5">
                {prompts.map((prompt) => {
                  const isSelected = (editingSkill.promptIds || []).includes(
                    prompt.id
                  );
                  return (
                    <label
                      key={prompt.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePrompt(prompt.id)}
                        className="rounded border-white/20 bg-navy-500 text-teal-500 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-300">{prompt.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

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
