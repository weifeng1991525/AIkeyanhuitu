'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MembershipCard from '@/components/auth/MembershipCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { MembershipTier, Membership, AccountBinding } from '@/types';
import { MEMBERSHIP_TIERS } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import {
  Crown,
  CreditCard,
  Settings,
  Smartphone,
  Mail,
  Lock,
  CheckCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Send,
} from 'lucide-react';

const plans = [
  {
    tier: 'FREE' as MembershipTier,
    price: 0,
    features: MEMBERSHIP_TIERS.FREE.features,
  },
  {
    tier: 'BASIC' as MembershipTier,
    price: 99,
    features: MEMBERSHIP_TIERS.BASIC.features,
  },
  {
    tier: 'PRO' as MembershipTier,
    price: 299,
    features: MEMBERSHIP_TIERS.PRO.features,
    popular: true,
  },
  {
    tier: 'ENTERPRISE' as MembershipTier,
    price: 999,
    features: MEMBERSHIP_TIERS.ENTERPRISE.features,
  },
];

export default function MembershipPage() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [binding, setBinding] = useState<AccountBinding>({
    phone: null,
    email: null,
    phoneVerified: false,
    emailVerified: false,
  });

  // Phone binding state
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [isSendingPhoneCode, setIsSendingPhoneCode] = useState(false);
  const [isBindingPhone, setIsBindingPhone] = useState(false);

  // Email binding state
  const [emailInput, setEmailInput] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isBindingEmail, setIsBindingEmail] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await fetch('/api/membership/plans');
        if (response.ok) {
          const data = await response.json();
          setMembership(data.membership);
        }
      } catch {
        // Silently fail
      }
    };
    fetchMembership();
  }, []);

  useEffect(() => {
    const fetchBinding = async () => {
      try {
        const response = await fetch('/api/membership/plans');
        if (response.ok) {
          const data = await response.json();
          if (data.binding) {
            setBinding(data.binding);
            if (data.binding.phone) setPhoneInput(data.binding.phone);
            if (data.binding.email) setEmailInput(data.binding.email);
          }
        }
      } catch {
        // Silently fail
      }
    };
    fetchBinding();
  }, []);

  // Phone verification code cooldown timer
  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const timer = setTimeout(() => setPhoneCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phoneCooldown]);

  // Email verification code cooldown timer
  useEffect(() => {
    if (emailCooldown <= 0) return;
    const timer = setTimeout(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [emailCooldown]);

  const handleSelect = async (tier: MembershipTier) => {
    if (tier === 'FREE') return;

    try {
      const response = await fetch('/api/membership/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('订阅成功！');
        setMembership(data.membership);
      } else {
        const error = await response.json();
        toast.error(error.message || '订阅失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    }
  };

  const handleSendPhoneCode = async () => {
    if (!phoneInput || !/^1\d{10}$/.test(phoneInput)) {
      toast.error('请输入正确的手机号');
      return;
    }
    setIsSendingPhoneCode(true);
    try {
      const response = await fetch('/api/membership/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_phone_code', phone: phoneInput }),
      });
      if (response.ok) {
        toast.success('验证码已发送');
        setPhoneCooldown(60);
      } else {
        const error = await response.json();
        toast.error(error.message || '发送失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsSendingPhoneCode(false);
    }
  };

  const handleBindPhone = async () => {
    if (!phoneInput || !phoneCode) {
      toast.error('请填写手机号和验证码');
      return;
    }
    setIsBindingPhone(true);
    try {
      const response = await fetch('/api/membership/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bind_phone', phone: phoneInput, code: phoneCode }),
      });
      if (response.ok) {
        toast.success(binding.phone ? '手机号已更新' : '手机号绑定成功');
        setBinding((prev) => ({ ...prev, phone: phoneInput, phoneVerified: true }));
        setPhoneCode('');
      } else {
        const error = await response.json();
        toast.error(error.message || '绑定失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsBindingPhone(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      toast.error('请输入正确的邮箱地址');
      return;
    }
    setIsSendingEmailCode(true);
    try {
      const response = await fetch('/api/membership/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_email_code', email: emailInput }),
      });
      if (response.ok) {
        toast.success('验证码已发送');
        setEmailCooldown(60);
      } else {
        const error = await response.json();
        toast.error(error.message || '发送失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleBindEmail = async () => {
    if (!emailInput || !emailCode) {
      toast.error('请填写邮箱和验证码');
      return;
    }
    setIsBindingEmail(true);
    try {
      const response = await fetch('/api/membership/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bind_email', email: emailInput, code: emailCode }),
      });
      if (response.ok) {
        toast.success(binding.email ? '邮箱已更新' : '邮箱绑定成功');
        setBinding((prev) => ({ ...prev, email: emailInput, emailVerified: true }));
        setEmailCode('');
      } else {
        const error = await response.json();
        toast.error(error.message || '绑定失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsBindingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('请填写所有密码字段');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('新密码至少需要8个字符');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/membership/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          oldPassword,
          newPassword,
        }),
      });
      if (response.ok) {
        toast.success('密码修改成功');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const error = await response.json();
        toast.error(error.message || '密码修改失败');
      }
    } catch {
      toast.error('网络错误，请重试');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
              <Crown size={14} className="text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">会员中心</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
              选择适合您的方案
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              从免费版到企业版，满足不同阶段的科研需求
            </p>
          </div>

          {/* Current membership info */}
          {membership && (
            <Card variant="glass" padding="md" className="max-w-2xl mx-auto mb-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-teal-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      当前方案：{MEMBERSHIP_TIERS[membership.tier].name}
                    </p>
                    <p className="text-xs text-gray-500">
                      剩余额度：{membership.creditsRemaining} / {membership.creditsTotal}
                    </p>
                  </div>
                </div>
                <Badge variant={membership.isActive ? 'success' : 'warning'} size="sm">
                  {membership.isActive ? '有效' : '已过期'}
                </Badge>
              </div>
            </Card>
          )}

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <MembershipCard
                key={plan.tier}
                membership={membership}
                tier={plan.tier}
                price={plan.price}
                features={plan.features}
                popular={plan.popular}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {/* ============================================ */}
          {/* Account Settings Section */}
          {/* ============================================ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full mb-4">
                <Settings size={14} className="text-teal-400" />
                <span className="text-sm text-teal-400 font-medium">账户设置</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                账户设置
              </h2>
              <p className="text-gray-400 text-sm">
                管理您的账户绑定信息和安全设置
              </p>
            </div>

            <div className="space-y-6">
              {/* Bind Phone Section */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                      <Smartphone className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-semibold text-white">
                        绑定手机号
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {binding.phone && binding.phoneVerified ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-xs text-emerald-400">已绑定</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-500 rounded-full" />
                            <span className="text-xs text-gray-500">未绑定</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {binding.phone && (
                    <Badge variant="success" size="sm">
                      <ShieldCheck size={12} className="mr-1" />
                      {binding.phoneVerified ? '已验证' : '未验证'}
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <Input
                    label="手机号"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    leftIcon={<Smartphone size={16} />}
                    maxLength={11}
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label="验证码"
                        type="text"
                        placeholder="请输入验证码"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        leftIcon={<ShieldCheck size={16} />}
                        maxLength={6}
                      />
                    </div>
                    <div className="pt-7">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleSendPhoneCode}
                        disabled={phoneCooldown > 0 || isSendingPhoneCode}
                        isLoading={isSendingPhoneCode}
                        leftIcon={<Send size={14} />}
                        className="whitespace-nowrap"
                      >
                        {phoneCooldown > 0 ? `${phoneCooldown}s` : '发送验证码'}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleBindPhone}
                    isLoading={isBindingPhone}
                    className="w-full"
                  >
                    {binding.phone ? '更新手机号' : '绑定手机号'}
                  </Button>
                </div>
              </Card>

              {/* Bind Email Section */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl">
                      <Mail className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-semibold text-white">
                        绑定邮箱
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {binding.email && binding.emailVerified ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-xs text-emerald-400">已绑定</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-500 rounded-full" />
                            <span className="text-xs text-gray-500">未绑定</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {binding.email && (
                    <Badge variant="success" size="sm">
                      <ShieldCheck size={12} className="mr-1" />
                      {binding.emailVerified ? '已验证' : '未验证'}
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <Input
                    label="邮箱地址"
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    leftIcon={<Mail size={16} />}
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label="验证码"
                        type="text"
                        placeholder="请输入验证码"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        leftIcon={<ShieldCheck size={16} />}
                        maxLength={6}
                      />
                    </div>
                    <div className="pt-7">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleSendEmailCode}
                        disabled={emailCooldown > 0 || isSendingEmailCode}
                        isLoading={isSendingEmailCode}
                        leftIcon={<Send size={14} />}
                        className="whitespace-nowrap"
                      >
                        {emailCooldown > 0 ? `${emailCooldown}s` : '发送验证码'}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleBindEmail}
                    isLoading={isBindingEmail}
                    className="w-full"
                  >
                    {binding.email ? '更新邮箱' : '绑定邮箱'}
                  </Button>
                </div>
              </Card>

              {/* Change Password Section - only shown if email is bound */}
              {binding.email && binding.emailVerified && (
                <Card variant="glass" padding="lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-red-500/10 rounded-xl">
                      <Lock className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-semibold text-white">
                        修改密码
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        绑定邮箱后可设置登录密码
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        label="当前密码"
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="请输入当前密码"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        label="新密码"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="请输入新密码（至少8位）"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <Input
                      label="确认新密码"
                      type="password"
                      placeholder="请再次输入新密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      leftIcon={<Lock size={16} />}
                    />
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleChangePassword}
                      isLoading={isChangingPassword}
                      className="w-full"
                    >
                      修改密码
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
