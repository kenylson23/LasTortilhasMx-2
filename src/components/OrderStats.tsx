import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Order } from '@shared/schema';

interface OrderStatsProps {
  className?: string;
}

export default function OrderStats({ className = '' }: OrderStatsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/orders');
      return response.json();
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds for real-time stats
    refetchIntervalInBackground: true, // Keep refreshing even when tab is not active
  });

  const getFilteredOrders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return orders.filter((order: Order) => {
      const orderDate = new Date(order.createdAt);
      
      switch (selectedPeriod) {
        case 'today':
          return orderDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const getStats = () => {
    const filteredOrders = getFilteredOrders();
    
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const ordersByStatus = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const ordersByType = filteredOrders.reduce((acc, order) => {
      acc[order.orderType] = (acc[order.orderType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const ordersByLocation = filteredOrders.reduce((acc, order) => {
      acc[order.locationId] = (acc[order.locationId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      ordersByType,
      ordersByLocation
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  const getLocationName = (locationId: string) => {
    switch (locationId) {
      case 'ilha': return 'Ilha';
      case 'talatona': return 'Talatona';
      case 'movel': return 'Móvel';
      default: return locationId;
    }
  };

  const getOrderTypeText = (orderType: string) => {
    switch (orderType) {
      case 'delivery': return 'Delivery';
      case 'takeaway': return 'Takeaway';
      case 'dine-in': return 'No Local';
      default: return orderType;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Recebidos';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Prontos';
      case 'delivered': return 'Entregues';
      case 'cancelled': return 'Cancelados';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Estatísticas de Pedidos</h2>
        <div className="flex gap-2">
          {['today', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'today' ? 'Hoje' : period === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Pedidos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor Médio</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.averageOrderValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Por Status</h3>
          <div className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{getStatusText(status)}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Por Tipo</h3>
          <div className="space-y-3">
            {Object.entries(stats.ordersByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{getOrderTypeText(type)}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Por Local</h3>
          <div className="space-y-3">
            {Object.entries(stats.ordersByLocation).map(([location, count]) => (
              <div key={location} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{getLocationName(location)}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}