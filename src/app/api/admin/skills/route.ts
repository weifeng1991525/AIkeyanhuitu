import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/skills - List all skills
 */
export async function GET() {
  try {
    await requireAdmin();

    const skills = await prisma.skill.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { prompts: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ skills, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Get skills error:', error);
    return NextResponse.json(
      { success: false, message: '获取Skill列表失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/skills - Create a new skill
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await request.json();
    const { name, description, category, icon, promptIds, sortOrder } = body;

    const skill = await prisma.skill.create({
      data: {
        name,
        description: description || '',
        category: category || '',
        icon: icon || 'Zap',
        sortOrder: sortOrder ?? 0,
        prompts: promptIds
          ? {
              connect: promptIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: { prompts: { select: { id: true, name: true } } },
    });

    await prisma.adminLog.create({
      data: {
        adminId: admin.userId,
        action: 'CREATE_SKILL',
        target: skill.id,
        details: `Created skill: ${name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ skill, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Create skill error:', error);
    return NextResponse.json(
      { success: false, message: '创建Skill失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/skills - Update a skill
 */
export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await request.json();
    const { id, promptIds, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少Skill ID' },
        { status: 400 }
      );
    }

    // If promptIds are provided, update the relation
    if (promptIds) {
      const existingSkill = await prisma.skill.findUnique({
        where: { id },
        include: { prompts: true },
      });

      if (existingSkill) {
        await prisma.skill.update({
          where: { id },
          data: {
            ...updateData,
            prompts: {
              set: promptIds.map((pid: string) => ({ id: pid })),
            },
          },
        });
      }
    } else {
      await prisma.skill.update({
        where: { id },
        data: updateData,
      });
    }

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: { prompts: { select: { id: true, name: true } } },
    });

    await prisma.adminLog.create({
      data: {
        adminId: admin.userId,
        action: 'UPDATE_SKILL',
        target: id,
        details: `Updated skill: ${skill?.name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ skill, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Update skill error:', error);
    return NextResponse.json(
      { success: false, message: '更新Skill失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/skills - Delete a skill
 */
export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少Skill ID' },
        { status: 400 }
      );
    }

    await prisma.skill.delete({ where: { id } });

    await prisma.adminLog.create({
      data: {
        adminId: admin.userId,
        action: 'DELETE_SKILL',
        target: id,
        details: `Deleted skill: ${id}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Delete skill error:', error);
    return NextResponse.json(
      { success: false, message: '删除Skill失败' },
      { status: 500 }
    );
  }
}
