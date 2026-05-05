'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import UserTable from '@/components/admin/UserTable';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `/api/admin/users?page=${page}&pageSize=${pageSize}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalCount(data.total || 0);
      }
    } catch {
      toast.error('获取用户列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBan = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'ban' }),
      });

      if (response.ok) {
        toast.success('用户已封禁');
        await fetchUsers();
      } else {
        toast.error('操作失败');
      }
    } catch {
      toast.error('网络错误');
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'unban' }),
      });

      if (response.ok) {
        toast.success('用户已解封');
        await fetchUsers();
      } else {
        toast.error('操作失败');
      }
    } catch {
      toast.error('网络错误');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          会员管理
        </h1>
        <p className="text-sm text-gray-500">
          管理平台用户、查看用户信息与操作封禁
        </p>
      </div>

      <UserTable
        users={users}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onBan={handleBan}
        onUnban={handleUnban}
        isLoading={isLoading}
      />
    </div>
  );
}
