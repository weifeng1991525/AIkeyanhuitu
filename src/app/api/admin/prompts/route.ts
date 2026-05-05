import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/prompts - List all prompts
 */
export async function GET() {
  try {
    await requireAdmin();

    const prompts = await prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ prompts, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Get prompts error:', error);
    return NextResponse.json(
      { success: false, message: '获取提示词失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/prompts - Create a new prompt
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await request.json();
    const {
      name,
      description,
      category,
      systemPrompt,
      userPromptTemplate,
      variables,
      model,
      temperature,
      maxTokens,
    } = body;

    const prompt = await prisma.prompt.create({
      data: {
        name,
        description: description || '',
        category: category || 'GENERAL',
        systemPrompt,
        userPromptTemplate: userPromptTemplate || '',
        variables: variables || [],
        model: model || 'gpt-4-turbo-preview',
        temperature: temperature ?? 0.7,
        maxTokens: maxTokens ?? 2000,
        isPublished: false,
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: admin.userId,
        action: 'CREATE_PROMPT',
        target: prompt.id,
        details: `Created prompt: ${name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ prompt, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Create prompt error:', error);
    return NextResponse.json(
      { success: false, message: '创建提示词失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/prompts - Update a prompt
 */
export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少提示词ID' },
        { status: 400 }
      );
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: updateData,
    });

    await prisma.adminLog.create({
      data: {
        adminId: admin.userId,
        action: 'UPDATE_PROMPT',
        target: id,
        details: `Updated prompt: ${prompt.name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ prompt, success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }
    console.error('Update prompt error:', error);
    return NextResponse.json(
      { success: false, message: '更新提示词失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/prompts - Delete a prompt
 */
export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少提示词ID' },
        { status: 400 }
      );
    }

    await prisma.prompt.delete({ where: { id } });

    await prisma.adminLog.create({
      data: {
        adminId: admin.userId,
        action: 'DELETE_PROMPT',
        target: id,
        details: `Deleted prompt: ${id}`,
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
    console.error('Delete prompt error:', error);
    return NextResponse.json(
      { success: false, message: '删除提示词失败' },
      { status: 500 }
    );
  }
}
