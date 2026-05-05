import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createToken } from '@/lib/auth';
import { getWeChatAccessToken, getWeChatUserInfo } from '@/lib/wechat';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: '缺少授权码' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenData = await getWeChatAccessToken(code);
    if (!tokenData.access_token || !tokenData.openid) {
      return NextResponse.json(
        { success: false, message: '获取微信access_token失败' },
        { status: 400 }
      );
    }

    // Get WeChat user info
    let wechatUser;
    try {
      wechatUser = await getWeChatUserInfo(
        tokenData.access_token,
        tokenData.openid
      );
    } catch {
      // If scope is snsapi_login, user info might not be available
      wechatUser = {
        openid: tokenData.openid,
        nickname: `user_${tokenData.openid.slice(0, 8)}`,
        headimgurl: '',
      };
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { wechatOpenId: tokenData.openid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: `${tokenData.openid}@wechat.medai.pro`,
          name: wechatUser.nickname || `用户${Date.now().toString(36)}`,
          avatar: wechatUser.headimgurl || undefined,
          wechatOpenId: tokenData.openid,
          wechatUnionId: tokenData.unionid || wechatUser.unionid || undefined,
          role: 'USER',
        },
      });

      // Create free membership for new user
      await prisma.membership.create({
        data: {
          userId: user.id,
          tier: 'FREE',
          creditsRemaining: 3,
          creditsTotal: 3,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          isActive: true,
          autoRenew: false,
        },
      });
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
      membershipTier: 'FREE',
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set('medai-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('WeChat callback error:', error);
    return NextResponse.json(
      { success: false, message: '微信登录失败' },
      { status: 500 }
    );
  }
}
