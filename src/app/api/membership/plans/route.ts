import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/membership/plans - Get membership plans and current membership
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    // Define plans
    const plans = [
      {
        id: 'free',
        tier: 'FREE',
        name: '免费版',
        price: 0,
        creditsPerDay: 3,
        features: ['每日3次生成', '基础假说图', '社区支持'],
      },
      {
        id: 'basic',
        tier: 'BASIC',
        name: '基础版',
        price: 99,
        creditsPerDay: 30,
        features: ['每日30次生成', '高级假说图', '技术路线图', '邮件支持'],
      },
      {
        id: 'pro',
        tier: 'PRO',
        name: '专业版',
        price: 299,
        creditsPerDay: -1, // unlimited
        features: ['无限生成', '全部功能', '优先渲染', '专属客服', 'API访问'],
        popular: true,
      },
      {
        id: 'enterprise',
        tier: 'ENTERPRISE',
        name: '企业版',
        price: 999,
        creditsPerDay: -1,
        features: ['无限生成', '全部功能', '私有部署', '定制模型', 'SLA保障'],
      },
    ];

    // Get current membership if logged in
    let membership = null;
    if (user) {
      membership = await prisma.membership.findFirst({
        where: { userId: user.userId, isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ plans, membership, success: true });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { success: false, message: '获取会员方案失败' },
      { status: 500 }
    );
  }
}
