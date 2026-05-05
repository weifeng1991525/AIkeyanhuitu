import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/custom-prompt
 * Return all saved prompts for the authenticated user
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    const prompts = await prisma.userPrompt.findMany({
      where: { userId: user.userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        systemPrompt: true,
        category: true,
        usageCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      prompts,
    });
  } catch (error) {
    console.error('Fetch custom prompts error:', error);
    return NextResponse.json(
      { success: false, message: '获取提示词失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/custom-prompt
 * Save a new custom prompt for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, systemPrompt, category } = body;

    if (!name || !systemPrompt) {
      return NextResponse.json(
        { success: false, message: '提示词名称和内容不能为空' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { success: false, message: '提示词名称不能超过100个字符' },
        { status: 400 }
      );
    }

    // Check prompt count limit (max 50 per user)
    const promptCount = await prisma.userPrompt.count({
      where: { userId: user.userId },
    });

    if (promptCount >= 50) {
      return NextResponse.json(
        { success: false, message: '提示词数量已达上限（50个），请删除部分提示词后再试' },
        { status: 400 }
      );
    }

    const prompt = await prisma.userPrompt.create({
      data: {
        userId: user.userId,
        name: name.trim(),
        description: (description || '').trim(),
        systemPrompt: systemPrompt.trim(),
        category: category || 'GENERAL',
        usageCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      prompt,
    });
  } catch (error) {
    console.error('Save custom prompt error:', error);
    return NextResponse.json(
      { success: false, message: '保存提示词失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/custom-prompt
 * Delete a custom prompt (ownership check required)
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '请提供提示词ID' },
        { status: 400 }
      );
    }

    // Verify ownership before deletion
    const prompt = await prisma.userPrompt.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: '提示词不存在' },
        { status: 404 }
      );
    }

    if (prompt.userId !== user.userId) {
      return NextResponse.json(
        { success: false, message: '无权删除此提示词' },
        { status: 403 }
      );
    }

    await prisma.userPrompt.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '提示词已删除',
    });
  } catch (error) {
    console.error('Delete custom prompt error:', error);
    return NextResponse.json(
      { success: false, message: '删除提示词失败' },
      { status: 500 }
    );
  }
}
