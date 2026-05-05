import axios from 'axios';

const WECHAT_APP_ID = process.env.WECHAT_APP_ID || '';
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || '';

const WECHAT_API_BASE = 'https://api.weixin.qq.com';

interface WeChatAccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
  unionid?: string;
}

interface WeChatUserInfo {
  openid: string;
  nickname: string;
  sex: number;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid?: string;
}

interface WeChatQrCodeResponse {
  appid: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  state: string;
}

/**
 * Generate WeChat OAuth URL for QR code login
 */
export function getWeChatLoginUrl(state: string): string {
  const redirectUri = encodeURIComponent(
    `${process.env.NEXTAUTH_URL}/api/auth/wechat/callback`
  );

  return `${WECHAT_API_BASE}/connect/qrconnect?appid=${WECHAT_APP_ID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
}

/**
 * Exchange authorization code for access token
 */
export async function getWeChatAccessToken(code: string): Promise<WeChatAccessTokenResponse> {
  const url = `${WECHAT_API_BASE}/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`;

  const response = await axios.get<WeChatAccessTokenResponse>(url);
  return response.data;
}

/**
 * Get WeChat user info using access token
 */
export async function getWeChatUserInfo(
  accessToken: string,
  openid: string
): Promise<WeChatUserInfo> {
  const url = `${WECHAT_API_BASE}/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;

  const response = await axios.get<WeChatUserInfo>(url);
  return response.data;
}

/**
 * Refresh WeChat access token
 */
export async function refreshWeChatToken(refreshToken: string): Promise<WeChatAccessTokenResponse> {
  const url = `${WECHAT_API_BASE}/sns/oauth2/refresh_token?appid=${WECHAT_APP_ID}&grant_type=refresh_token&refresh_token=${refreshToken}`;

  const response = await axios.get<WeChatAccessTokenResponse>(url);
  return response.data;
}

/**
 * Verify WeChat access token is valid
 */
export async function verifyWeChatToken(
  accessToken: string,
  openid: string
): Promise<boolean> {
  try {
    const url = `${WECHAT_API_BASE}/sns/auth?access_token=${accessToken}&openid=${openid}`;
    const response = await axios.get<{ errcode: number }>(url);
    return response.data.errcode === 0;
  } catch {
    return false;
  }
}
