'use client';

import React, { useState, useEffect } from 'react';
import { Skill, Prompt } from '@/types';
import SkillEditor from '@/components/admin/SkillEditor';
import { toast } from 'react-hot-toast';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSkills(), fetchPrompts()]);
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
      }
    } catch {
      toast.error('获取Skill列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/admin/prompts');
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.prompts || []);
      }
    } catch {
      // Silently fail
    }
  };

  const handleSave = async (skill: Partial<Skill>) => {
    try {
      const response = await fetch('/api/admin/skills', {
        method: skill.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });

      if (response.ok) {
        toast.success(skill.id ? 'Skill已更新' : 'Skill已创建');
        await fetchSkills();
      } else {
        toast.error('保存失败');
      }
    } catch {
      toast.error('网络错误');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此Skill吗？')) return;

    try {
      const response = await fetch('/api/admin/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success('Skill已删除');
        await fetchSkills();
      } else {
        toast.error('删除失败');
      }
    } catch {
      toast.error('网络错误');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Skill管理
        </h1>
        <p className="text-sm text-gray-500">
          管理平台的AI技能模块，每个Skill可关联多个提示词
        </p>
      </div>

      <SkillEditor
        skills={skills}
        prompts={prompts.map((p) => ({ id: p.id, name: p.name }))}
        onSave={handleSave}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
