import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format
 */
export function formatDate(date: Date | string, pattern: string = 'yyyy-MM-dd HH:mm'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, pattern, { locale: zhCN });
}

/**
 * Format a date to relative time (e.g., "3 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN });
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Generate a random ID (for non-critical use)
 */
export function generateId(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Mask sensitive information (e.g., API keys)
 */
export function maskSensitive(str: string, visibleChars: number = 4): string {
  if (str.length <= visibleChars) return '*'.repeat(str.length);
  return str.slice(0, visibleChars) + '*'.repeat(str.length - visibleChars);
}

/**
 * Calculate pagination info
 */
export function getPagination(
  page: number = 1,
  pageSize: number = 10
): { skip: number; take: number } {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

/**
 * Membership tier display names
 */
export const MEMBERSHIP_TIERS: Record<string, { name: string; color: string; features: string[] }> = {
  FREE: {
    name: '免费版',
    color: 'text-gray-400',
    features: ['每日3次生成', '基础假说图', '社区支持'],
  },
  BASIC: {
    name: '基础版',
    color: 'text-teal-500',
    features: ['每日30次生成', '高级假说图', '技术路线图', '邮件支持'],
  },
  PRO: {
    name: '专业版',
    color: 'text-amber-500',
    features: ['无限生成', '全部功能', '优先渲染', '专属客服', 'API访问'],
  },
  ENTERPRISE: {
    name: '企业版',
    color: 'text-purple-500',
    features: ['无限生成', '全部功能', '私有部署', '定制模型', 'SLA保障'],
  },
};
