'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Ban, Unban, Shield, MoreHorizontal } from 'lucide-react';

interface UserTableProps {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onBan: (userId: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function UserTable({
  users,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onBan,
  onUnban,
  isLoading = false,
}: UserTableProps) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: '用户',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: '角色',
      render: (user: User) => (
        <Badge variant={user.role === 'ADMIN' ? 'amber' : 'default'} size="sm">
          {user.role === 'ADMIN' ? '管理员' : '用户'}
        </Badge>
      ),
    },
    {
      key: 'isBanned',
      header: '状态',
      render: (user: User) => (
        <Badge variant={user.isBanned ? 'danger' : 'success'} size="sm">
          {user.isBanned ? '已封禁' : '正常'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: '注册时间',
      render: (user: User) => (
        <span className="text-sm text-gray-400">
          {new Date(user.createdAt).toLocaleDateString('zh-CN')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      render: (user: User) => (
        <div className="flex items-center gap-1">
          {user.isBanned ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUnban(user.id)}
              leftIcon={<Unban size={12} />}
            >
              解封
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBan(user.id)}
              leftIcon={<Ban size={12} />}
              className="text-red-400 hover:text-red-300"
            >
              封禁
            </Button>
          )}
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-display font-semibold text-white">
            会员管理
          </h2>
          <Badge variant="teal" size="sm">
            共 {totalCount} 位用户
          </Badge>
        </div>
        <Input
          placeholder="搜索用户..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
          leftIcon={<Search size={14} />}
        />
      </div>

      <Table
        columns={columns}
        data={filteredUsers as unknown as Record<string, unknown>[]}
        keyExtractor={(item) => (item as unknown as User).id}
        isLoading={isLoading}
        emptyMessage="暂无用户数据"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            第 {page} / {totalPages} 页
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              上一页
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
