import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateImage, logGeneration } from '@/lib/ai';
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
    const body = await request.json();
    const { prompt, style, size, quality } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: '请输入图像描述' },
        { status: 400 }
      );
    }

    // Generate image using the unified OpenAI client (kuaipao.ai)
    const result = await generateImage({
      prompt,
      style: style || 'scientific',
      size: size || '1024x1024',
      quality: quality || 'high',
    });

    // Determine the final URL (prefer local path from Base64 save)
    const imageUrl = result.localPath || result.url;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: '图像生成未返回有效结果' },
        { status: 500 }
      );
    }

    // Decrement credits (images cost 2 credits)
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
      imageUrl,
      tokensUsed: 0,
    });

    return NextResponse.json({
      success: true,
      url: imageUrl,
      localPath: result.localPath,
      revisedPrompt: result.revisedPrompt,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { success: false, message: '图像生成失败，请重试' },
      { status: 500 }
    );
  }
}
