import { NextRequest, NextResponse } from 'next/server';
import { getWeChatLoginUrl } from '@/lib/wechat';

export async function GET(request: NextRequest) {
  try {
    const state = request.nextUrl.searchParams.get('state') || 'default';

    const url = getWeChatLoginUrl(state);

    return NextResponse.json({ url, success: true });
  } catch (error) {
    console.error('WeChat login URL error:', error);
    return NextResponse.json(
      { success: false, message: '获取微信登录链接失败' },
      { status: 500 }
    );
  }
}
