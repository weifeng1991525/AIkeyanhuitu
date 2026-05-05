'use client';

import React from 'react';
import { ImageFormData } from '@/types';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import {
  Image as ImageIcon,
  Palette,
  Maximize,
  Sparkle,
} from 'lucide-react';

interface ImageSettingsProps {
  settings: ImageFormData;
  onChange: (settings: ImageFormData) => void;
}

export default function ImageSettings({ settings, onChange }: ImageSettingsProps) {
  const handleChange = (field: keyof ImageFormData, value: string) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Card variant="glass" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-4 w-4 text-teal-400" />
        <h3 className="text-sm font-semibold text-white">图像设置</h3>
      </div>

      <div className="space-y-4">
        <Select
          label="图像风格"
          value={settings.style}
          onChange={(e) => handleChange('style', e.target.value)}
          options={[
            {
              value: 'scientific',
              label: '科学插图 - Scientific Illustration',
            },
            {
              value: 'schematic',
              label: '示意图 - Schematic Diagram',
            },
            {
              value: 'abstract',
              label: '抽象可视化 - Abstract Visualization',
            },
            {
              value: 'realistic',
              label: '写实风格 - Realistic',
            },
          ]}
        />

        <Select
          label="图像尺寸"
          value={settings.size}
          onChange={(e) => handleChange('size', e.target.value)}
          options={[
            { value: '1024x1024', label: '1:1 正方形 (1024x1024)' },
            { value: '1792x1024', label: '16:9 横版 (1792x1024)' },
            { value: '1024x1792', label: '9:16 竖版 (1024x1792)' },
          ]}
        />

        <Select
          label="图像质量"
          value={settings.quality}
          onChange={(e) => handleChange('quality', e.target.value)}
          options={[
            { value: 'standard', label: '标准质量 (Standard)' },
            { value: 'hd', label: '高清质量 (HD)' },
          ]}
        />

        <Input
          label="自定义提示词（可选）"
          placeholder="补充描述图像细节..."
          value={settings.prompt}
          onChange={(e) => handleChange('prompt', e.target.value)}
          leftIcon={<Sparkle size={16} />}
          hint="留空则使用AI自动生成的提示词"
        />
      </div>
    </Card>
  );
}
