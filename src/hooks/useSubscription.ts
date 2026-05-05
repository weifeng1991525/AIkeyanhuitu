'use client';

import { create } from 'zustand';
import { Membership, MembershipPlan } from '@/types';

interface SubscriptionStore {
  membership: Membership | null;
  plans: MembershipPlan[];
  isLoading: boolean;
  setMembership: (membership: Membership | null) => void;
  setPlans: (plans: MembershipPlan[]) => void;
  setLoading: (loading: boolean) => void;
  fetchMembership: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  canGenerate: () => boolean;
  decrementCredits: () => void;
}

export const useSubscription = create<SubscriptionStore>((set, get) => ({
  membership: null,
  plans: [],
  isLoading: false,

  setMembership: (membership) => set({ membership }),
  setPlans: (plans) => set({ plans }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchMembership: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/membership/plans');
      if (response.ok) {
        const data = await response.json();
        set({ membership: data.membership, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchPlans: async () => {
    try {
      const response = await fetch('/api/membership/plans');
      if (response.ok) {
        const data = await response.json();
        set({ plans: data.plans });
      }
    } catch {
      // Silently fail
    }
  },

  canGenerate: () => {
    const { membership } = get();
    if (!membership) return false;

    // FREE tier has limited daily credits
    if (membership.tier === 'FREE') {
      return membership.creditsRemaining > 0;
    }

    // Paid tiers have generous limits
    return membership.isActive;
  },

  decrementCredits: () => {
    const { membership } = get();
    if (membership && membership.creditsRemaining > 0) {
      set({
        membership: {
          ...membership,
          creditsRemaining: membership.creditsRemaining - 1,
        },
      });
    }
  },
}));
