import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateCustomImage, logGeneration } from '@/lib/ai';
import prisma from '@/lib/db';

/**
 * POST /api/generate/custom-image
 * Generate an image using the user's custom prompt
 * Requires authentication and deducts credits
 */
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
    const body = await request.json();
    const { prompt, size, quality } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: '请输入图像描述' },
        { status: 400 }
      );
    }

    // Validate prompt length
    if (prompt.length > 4000) {
      return NextResponse.json(
        { success: false, message: '提示词长度不能超过4000个字符' },
        { status: 400 }
      );
    }

    // Generate image using custom prompt via the unified OpenAI client (kuaipao.ai)
    const result = await generateCustomImage({
      prompt,
      size: size || '1024x1024',
      quality: quality || 'high',
      outputFormat: 'png',
    });

    // Decrement credits (custom image generation costs 2 credits)
    await prisma.membership.update({
      where: { id: membership.id },
      data: { creditsRemaining: { decrement: 2 } },
    });

    // Log generation
    await logGeneration({
      userId: user.userId,
      type: 'IMAGE',
      input: prompt,
      output: result.revisedPrompt,
      imageUrl: result.url,
      tokensUsed: 0,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      localPath: result.localPath,
      revisedPrompt: result.revisedPrompt,
    });
  } catch (error) {
    console.error('Custom image generation error:', error);
    return NextResponse.json(
      { success: false, message: '图像生成失败，请重试' },
      { status: 500 }
    );
  }
}
