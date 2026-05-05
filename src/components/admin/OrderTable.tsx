'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Download, Eye } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function OrderTable({
  orders,
  totalCount,
  page,
  pageSize,
  onPageChange,
  isLoading = false,
}: OrderTableProps) {
  const [search, setSearch] = useState('');

  const columns = [
    {
      key: 'id',
      header: '订单号',
      render: (order: Order) => (
        <span className="text-xs font-mono text-gray-400">
          {order.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: 'type',
      header: '类型',
      render: (order: Order) => (
        <Badge variant={order.type === 'SUBSCRIPTION' ? 'teal' : 'info'} size="sm">
          {order.type === 'SUBSCRIPTION' ? '订阅' : '充值'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: '金额',
      render: (order: Order) => (
        <span className="text-sm font-semibold text-white">
          {order.currency === 'CNY' ? '¥' : '$'}
          {(order.amount / 100).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: '状态',
      render: (order: Order) => {
        const statusMap: Record<string, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
          PAID: { variant: 'success', label: '已支付' },
          PENDING: { variant: 'warning', label: '待支付' },
          FAILED: { variant: 'danger', label: '失败' },
          REFUNDED: { variant: 'default', label: '已退款' },
        };
        const status = statusMap[order.status] || statusMap.PENDING;
        return <Badge variant={status.variant} size="sm">{status.label}</Badge>;
      },
    },
    {
      key: 'paymentMethod',
      header: '支付方式',
      render: (order: Order) => (
        <span className="text-sm text-gray-400">{order.paymentMethod}</span>
      ),
    },
    {
      key: 'createdAt',
      header: '创建时间',
      render: (order: Order) => (
        <span className="text-sm text-gray-400">
          {new Date(order.createdAt).toLocaleDateString('zh-CN')}
        </span>
      ),
    },
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-display font-semibold text-white">
            充值订单
          </h2>
          <Badge variant="amber" size="sm">
            共 {totalCount} 笔订单
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="搜索订单..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
            leftIcon={<Search size={14} />}
          />
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
            导出
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={orders as unknown as Record<string, unknown>[]}
        keyExtractor={(item) => (item as unknown as Order).id}
        isLoading={isLoading}
        emptyMessage="暂无订单数据"
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
