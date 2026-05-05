'use client';

import React from 'react';
import { Membership, MembershipTier } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MEMBERSHIP_TIERS } from '@/lib/utils';
import {
  Crown,
  Check,
  Zap,
  Star,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface MembershipCardProps {
  membership: Membership | null;
  tier: MembershipTier;
  price: number;
  features: string[];
  popular?: boolean;
  onSelect?: (tier: MembershipTier) => void;
}

const tierIcons: Record<MembershipTier, React.ReactNode> = {
  FREE: <Zap size={20} />,
  BASIC: <Star size={20} />,
  PRO: <Crown size={20} />,
  ENTERPRISE: <Building2 size={20} />,
};

const tierColors: Record<MembershipTier, string> = {
  FREE: 'from-gray-600/20 to-gray-700/20 border-gray-500/20',
  BASIC: 'from-teal-600/20 to-teal-700/20 border-teal-500/20',
  PRO: 'from-amber-600/20 to-amber-700/20 border-amber-500/20',
  ENTERPRISE: 'from-purple-600/20 to-purple-700/20 border-purple-500/20',
};

const tierAccentColors: Record<MembershipTier, string> = {
  FREE: 'text-gray-400',
  BASIC: 'text-teal-400',
  PRO: 'text-amber-400',
  ENTERPRISE: 'text-purple-400',
};

export default function MembershipCard({
  membership,
  tier,
  price,
  features,
  popular = false,
  onSelect,
}: MembershipCardProps) {
  const isActive = membership?.tier === tier && membership.isActive;
  const tierInfo = MEMBERSHIP_TIERS[tier];

  return (
    <Card
      variant="default"
      padding="none"
      className={`relative overflow-hidden ${
        popular ? 'ring-2 ring-amber-500/50' : ''
      } ${isActive ? 'ring-2 ring-teal-500/50' : ''}`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute top-0 right-0 bg-amber-500 text-navy-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
          最受欢迎
        </div>
      )}

      {/* Active badge */}
      {isActive && (
        <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          当前方案
        </div>
      )}

      {/* Gradient header */}
      <div
        className={`bg-gradient-to-br ${tierColors[tier]} p-6 border-b border-white/5`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`${tierAccentColors[tier]}`}>{tierIcons[tier]}</div>
          <h3 className="text-lg font-display font-bold text-white">
            {tierInfo.name}
          </h3>
        </div>
        <div className="flex items-baseline gap-1">
          {price > 0 ? (
            <>
              <span className="text-3xl font-bold text-white font-display">
                ¥{price}
              </span>
              <span className="text-sm text-gray-400">/月</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-white font-display">
              免费
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="p-6">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <Check
                size={16}
                className={`${tierAccentColors[tier]} mt-0.5 flex-shrink-0`}
              />
              <span className="text-sm text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Credits info */}
        {membership && membership.tier === tier && (
          <div className="mb-4 p-3 bg-navy-500/50 rounded-lg border border-white/5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">剩余额度</span>
              <span className={`${tierAccentColors[tier]} font-semibold`}>
                {membership.creditsRemaining} / {membership.creditsTotal}
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-navy-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(membership.creditsRemaining / membership.creditsTotal) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <Button
          variant={isActive ? 'secondary' : 'primary'}
          className="w-full"
          disabled={isActive}
          onClick={() => onSelect?.(tier)}
          rightIcon={!isActive ? <ArrowRight size={16} /> : undefined}
        >
          {isActive ? '当前方案' : price > 0 ? '立即订阅' : '免费开始'}
        </Button>
      </div>
    </Card>
  );
}
