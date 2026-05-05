'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/types';
import OrderTable from '@/components/admin/OrderTable';
import { toast } from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `/api/membership/orders?page=${page}&pageSize=${pageSize}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalCount(data.total || 0);
      }
    } catch {
      toast.error('获取订单列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          充值订单
        </h1>
        <p className="text-sm text-gray-500">
          查看所有充值与订阅订单记录
        </p>
      </div>

      <OrderTable
        orders={orders}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
