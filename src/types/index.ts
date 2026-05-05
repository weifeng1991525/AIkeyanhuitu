// ============================================
// MedAI Pro - Type Definitions
// ============================================

// --- User & Auth ---
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  wechatOpenId?: string;
  wechatUnionId?: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// --- Membership ---
export type MembershipTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface Membership {
  id: string;
  userId: string;
  tier: MembershipTier;
  creditsRemaining: number;
  creditsTotal: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

export interface MembershipPlan {
  id: string;
  tier: MembershipTier;
  name: string;
  price: number;
  creditsPerDay: number;
  features: string[];
  popular?: boolean;
}

// --- Order ---
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderType = 'SUBSCRIPTION' | 'CREDIT_TOPUP';

export interface Order {
  id: string;
  userId: string;
  type: OrderType;
  amount: number;
  currency: string;
  status: OrderStatus;
  membershipTier?: MembershipTier;
  creditsAdded?: number;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Prompt ---
export interface Prompt {
  id: string;
  name: string;
  description: string;
  category: 'HYPOTHESIS' | 'ROADMAP' | 'IMAGE' | 'GENERAL';
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
  model: string;
  temperature: number;
  maxTokens: number;
  isPublished: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Skill ---
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  promptIds: string[];
  isPublished: boolean;
  sortOrder: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Generation ---
export type GenerationType = 'HYPOTHESIS' | 'ROADMAP' | 'IMAGE';

export interface GenerationLog {
  id: string;
  userId: string;
  type: GenerationType;
  input: string;
  output: string;
  imageUrl?: string;
  tokensUsed: number;
  duration: number;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  createdAt: string;
}

// --- Admin ---
export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

// --- Analytics ---
export interface AnalyticsData {
  date: string;
  totalUsers: number;
  newUsers: number;
  totalGenerations: number;
  hypothesisCount: number;
  roadmapCount: number;
  imageCount: number;
  revenue: number;
  activeSubscriptions: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalGenerations: number;
  generationsToday: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeSubscriptions: number;
  premiumConversionRate: number;
}

// --- API ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- Generation Form ---
export interface HypothesisFormData {
  researchTopic: string;
  diseaseArea: string;
  methodology: string;
  keyVariables: string;
  language: 'zh' | 'en';
}

export interface RoadmapFormData {
  researchGoal: string;
  currentStage: string;
  timeline: string;
  resources: string;
  language: 'zh' | 'en';
}

export interface ImageFormData {
  prompt: string;
  style: 'scientific' | 'schematic' | 'abstract' | 'realistic';
  size: '1024x1024' | '1792x1024' | '1024x1792';
  quality: 'standard' | 'hd';
}

// --- Account Binding ---
export interface AccountBinding {
  phone: string | null;
  email: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
}

export interface UserPrompt {
  id: string;
  userId: string;
  name: string;
  description: string;
  systemPrompt: string;
  category: 'HYPOTHESIS' | 'ROADMAP' | 'IMAGE' | 'GENERAL';
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}
