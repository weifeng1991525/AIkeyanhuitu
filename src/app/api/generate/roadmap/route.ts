import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateRoadmap, generateRoadmapImage, logGeneration } from '@/lib/ai';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    // Check credits
    const membership = await prisma.membership.findFirst({
      where: { userId: user.userId, isActive: true },
    });

    if (!membership || membership.creditsRemaining <= 0) {
      return NextResponse.json(
        { success: false, message: '额度不足，请升级会员方案' },
        { status: 403 }
      );
    }

    // Parse request body
    const { content, language } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: '请输入研究内容' },
        { status: 400 }
      );
    }

    // Generate roadmap
    const startTime = Date.now();
    const result = await generateRoadmap({ content, language: language || 'zh' });

    // Generate roadmap image
    let imageUrl: string | undefined;
    try {
      const imageResult = await generateRoadmapImage({
        prompt: `Technical research roadmap visualization: ${result.roadmap}. Phases: ${result.phases.map(p => p.phase).join(', ')}. Professional flowchart style, vertical layout, clean design.`,
        style: 'schematic',
      });
      imageUrl = imageResult.localPath || imageResult.url;
    } catch (imageError) {
      console.error('Roadmap image generation failed (non-blocking):', imageError);
      // Image generation failure should not block the roadmap text response
    }

    const duration = Date.now() - startTime;

    // Decrement credits
    await prisma.membership.update({
      where: { id: membership.id },
      data: { creditsRemaining: { decrement: 1 } },
    });

    // Log generation
    await logGeneration({
      userId: user.userId,
      type: 'ROADMAP',
      input: content,
      output: JSON.stringify(result),
      imageUrl,
      tokensUsed: 0,
    });

    return NextResponse.json({
      success: true,
      ...result,
      imageUrl,
    });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    return NextResponse.json(
      { success: false, message: '生成失败，请重试' },
      { status: 500 }
    );
  }
}
