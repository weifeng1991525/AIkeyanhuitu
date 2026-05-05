import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/analytics - Get platform analytics data
 */
export async function GET() {
  try {
    await requireAdmin();

    // Get date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aggregate stats
    const [
      totalUsers,
      activeUsersToday,
      totalGenerations,
      generationsToday,
      totalRevenue,
      revenueThisMonth,
      activeSubscriptions,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active users today
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Total generations
      prisma.generationLog.count(),

      // Generations today
      prisma.generationLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Total revenue
      prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),

      // Revenue this month
      prisma.order.aggregate({
        where: {
          status: 'PAID',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),

      // Active subscriptions
      prisma.membership.count({
        where: { isActive: true, tier: { not: 'FREE' } },
      }),
    ]);

    // Daily data for charts (last 30 days)
    const dailyData = await prisma.$queryRaw<Array<{
      date: string;
      totalUsers: number;
      newUsers: number;
      totalGenerations: number;
      hypothesisCount: number;
      roadmapCount: number;
      imageCount: number;
      revenue: number;
      activeSubscriptions: number;
    }>>`
      SELECT
        d.date::text as date,
        COALESCE(u.total_users, 0) as "totalUsers",
        COALESCE(u.new_users, 0) as "newUsers",
        COALESCE(g.total_generations, 0) as "totalGenerations",
        COALESCE(g.hypothesis_count, 0) as "hypothesisCount",
        COALESCE(g.roadmap_count, 0) as "roadmapCount",
        COALESCE(g.image_count, 0) as "imageCount",
        COALESCE(o.revenue, 0) as "revenue",
        COALESCE(m.active_subs, 0) as "activeSubscriptions"
      FROM (
        SELECT generate_series(
          DATE '${thirtyDaysAgo.toISOString().split('T')[0]}',
          CURRENT_DATE,
          '1 day'::interval
        )::date as date
      ) d
      LEFT JOIN (
        SELECT
          DATE(created_at) as dt,
          COUNT(*) OVER (ORDER BY DATE(created_at)) as total_users,
          COUNT(*) as new_users
        FROM "User"
        WHERE created_at >= '${thirtyDaysAgo.toISOString()}'
        GROUP BY DATE(created_at)
      ) u ON d.date = u.dt
      LEFT JOIN (
        SELECT
          DATE(created_at) as dt,
          COUNT(*) as total_generations,
          COUNT(*) FILTER (WHERE type = 'HYPOTHESIS') as hypothesis_count,
          COUNT(*) FILTER (WHERE type = 'ROADMAP') as roadmap_count,
          COUNT(*) FILTER (WHERE type = 'IMAGE') as image_count
        FROM "GenerationLog"
        WHERE created_at >= '${thirtyDaysAgo.toISOString()}'
        GROUP BY DATE(created_at)
      ) g ON d.date = g.dt
      LEFT JOIN (
        SELECT
          DATE(created_at) as dt,
          SUM(amount) as revenue
        FROM "Order"
        WHERE status = 'PAID' AND created_at >= '${thirtyDaysAgo.toISOString()}'
        GROUP BY DATE(created_at)
      ) o ON d.date = o.dt
      LEFT JOIN (
        SELECT
          DATE(start_date) as dt,
          COUNT(*) as active_subs
        FROM "Membership"
        WHERE is_active = true
        GROUP BY DATE(start_date)
      ) m ON d.date = m.dt
      ORDER BY d.date
    `;

    const premiumUsers = await prisma.membership.count({
      where: { isActive: true, tier: { not: 'FREE' } },
    });

    const stats = {
      totalUsers,
      activeUsersToday,
      totalGenerations,
      generationsToday,
      totalRevenue: totalRevenue._sum.amount || 0,
      revenueThisMonth: revenueThisMonth._sum.amount || 0,
      activeSubscriptions,
      premiumConversionRate:
        totalUsers > 0
          ? parseFloat(((premiumUsers / totalUsers) * 100).toFixed(1))
          : 0,
    };

    return NextResponse.json({
      data: dailyData,
      stats,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, message: '获取分析数据失败' },
      { status: 500 }
    );
  }
}
