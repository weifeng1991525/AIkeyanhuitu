import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/users - List users with pagination
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isBanned: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      success: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users - Ban or unban a user
 */
export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, message: '缺少参数' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: action === 'ban' },
    });

    await prisma.adminLog.create({
      data: {
        adminId: admin.userId,
        action: action === 'ban' ? 'BAN_USER' : 'UNBAN_USER',
        target: userId,
        details: `${action === 'ban' ? 'Banned' : 'Unbanned'} user: ${user.name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ user, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: '操作失败' },
      { status: 500 }
    );
  }
}
