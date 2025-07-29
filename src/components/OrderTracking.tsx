import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Order, OrderItem } from '@shared/schema';

interface OrderTrackingProps {
  orderId: string;
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const [isVisible, setIsVisible] = useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['/api/orders', orderId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/orders/${orderId}`);
      return response.json();
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    enabled: !!orderId
  });

  const getStatusSteps = () => {
    const steps = [
      { key: 'received', label: 'Pedido Recebido', icon: '📝' },
      { key: 'preparing', label: 'Preparando', icon: '👨‍🍳' },
      { key: 'ready', label: 'Pronto', icon: '✅' },
      { key: 'delivered', label: 'Entregue', icon: '🚚' }
    ];

    if (order?.status === 'cancelled') {
      return [
        { key: 'received', label: 'Pedido Recebido', icon: '📝' },
        { key: 'cancelled', label: 'Cancelado', icon: '❌' }
      ];
    }

    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps();
    return steps.findIndex(step => step.key === order?.status);
  };

  const getEstimatedTime = () => {
    if (!order?.estimatedDeliveryTime) return null;
    
    const estimatedTime = new Date(order.estimatedDeliveryTime);
    const now = new Date();
    const diffMinutes = Math.max(0, Math.floor((estimatedTime.getTime() - now.getTime()) / (1000 * 60)));
    
    if (diffMinutes === 0) return 'Chegando agora';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const getLocationName = (locationId: string) => {
    switch (locationId) {
      case 'ilha': return 'Las Tortillas Ilha';
      case 'talatona': return 'Las Tortillas Talatona';
      case 'movel': return 'Las Tortillas Móvel';
      default: return locationId;
    }
  };

  const getOrderTypeText = (orderType: string) => {
    switch (orderType) {
      case 'delivery': return 'Delivery';
      case 'takeaway': return 'Takeaway';
      case 'dine-in': return 'Comer no local';
      default: return orderType;
    }
  };

  const shareOrderStatus = () => {
    const message = `Meu pedido #${orderId} no Las Tortillas está: ${getStatusText(order?.status)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Recebido';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido não encontrado</h2>
        <p className="text-gray-600">Verifique o código do pedido e tente novamente.</p>
      </div>
    );
  }

  const steps = getStatusSteps();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rastreamento do Pedido</h1>
          <p className="text-lg text-gray-600">Pedido #{orderId}</p>
        </div>

        {/* Order Status */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Status Atual</h2>
              <p className="text-2xl font-bold text-red-600">{getStatusText(order.status)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tempo estimado</p>
              <p className="text-lg font-semibold text-green-600">
                {getEstimatedTime() || 'Calculando...'}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            {steps.map((step, index) => (
              <div key={step.key} className="relative flex items-center mb-4 last:mb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg z-10 ${
                  index <= currentStepIndex 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index <= currentStepIndex ? '✓' : step.icon}
                </div>
                <div className="ml-4">
                  <p className={`font-semibold ${
                    index <= currentStepIndex ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </p>
                  {index === currentStepIndex && (
                    <p className="text-sm text-gray-500">Em andamento...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Detalhes do Pedido</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Local:</p>
              <p className="font-semibold">{getLocationName(order.locationId)}</p>
            </div>
            <div>
              <p className="text-gray-600">Tipo:</p>
              <p className="font-semibold">{getOrderTypeText(order.orderType)}</p>
            </div>
            <div>
              <p className="text-gray-600">Cliente:</p>
              <p className="font-semibold">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-600">Telefone:</p>
              <p className="font-semibold">{order.customerPhone}</p>
            </div>
            {order.deliveryAddress && (
              <div className="col-span-2">
                <p className="text-gray-600">Endereço:</p>
                <p className="font-semibold">{order.deliveryAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Itens do Pedido</h3>
          <div className="space-y-3">
            {order.items?.map((item: OrderItem, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.quantity}x Item #{item.menuItemId}</p>
                  {item.customizations?.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {item.customizations.join(', ')}
                    </p>
                  )}
                </div>
                <p className="font-semibold">{item.subtotal} AOA</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-red-600">{order.totalAmount} AOA</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={shareOrderStatus}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Compartilhar Status
          </button>
          <button
            onClick={() => window.location.href = `https://wa.me/244949639932?text=${encodeURIComponent(`Olá! Gostaria de saber sobre o meu pedido #${orderId}`)}`}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Entrar em Contato
          </button>
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Atualização automática a cada 30 segundos</p>
        </div>
      </div>
    </div>
  );
}