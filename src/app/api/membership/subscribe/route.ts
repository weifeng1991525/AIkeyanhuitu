import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

const TIER_CREDITS: Record<string, number> = {
  FREE: 3,
  BASIC: 900, // 30/day * 30 days
  PRO: 99999, // effectively unlimited
  ENTERPRISE: 99999,
};

const TIER_PRICES: Record<string, number> = {
  BASIC: 9900, // 99 yuan in cents
  PRO: 29900,
  ENTERPRISE: 99900,
};

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    const { tier } = await request.json();

    if (!tier || !['BASIC', 'PRO', 'ENTERPRISE'].includes(tier)) {
      return NextResponse.json(
        { success: false, message: '无效的会员方案' },
        { status: 400 }
      );
    }

    // In production, this would integrate with a payment gateway (e.g., Stripe, WeChat Pay)
    // For now, we simulate a successful payment

    // Create order record
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        type: 'SUBSCRIPTION',
        amount: TIER_PRICES[tier],
        currency: 'CNY',
        status: 'PAID',
        membershipTier: tier,
        paymentMethod: 'wechat_pay',
        transactionId: `sim_${Date.now()}`,
      },
    });

    // Deactivate existing memberships
    await prisma.membership.updateMany({
      where: { userId: user.userId, isActive: true },
      data: { isActive: false },
    });

    // Create new membership
    const membership = await prisma.membership.create({
      data: {
        userId: user.userId,
        tier: tier as 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE',
        creditsRemaining: TIER_CREDITS[tier],
        creditsTotal: TIER_CREDITS[tier],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        autoRenew: false,
      },
    });

    return NextResponse.json({
      success: true,
      membership,
      order,
      message: '订阅成功',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { success: false, message: '订阅失败' },
      { status: 500 }
    );
  }
}
