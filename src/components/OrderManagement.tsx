import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Order, OrderItem, MenuItem } from '@shared/schema';
import { useToast } from '../hooks/use-toast';
import { X, Edit3, Trash2, MessageSquare, Clock, CheckCircle, XCircle, Truck, Phone, MapPin, CreditCard, FileText, Share2 } from 'lucide-react';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

export default function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/orders', selectedStatus, selectedLocation],
    queryFn: async () => {
      let url = '/api/orders';
      const params = new URLSearchParams();
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      if (selectedLocation !== 'all') {
        params.append('location', selectedLocation);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await apiRequest('GET', url);
      return response.json();
    },
    refetchInterval: 3000, // Auto-refresh every 3 seconds for real-time updates
    refetchIntervalInBackground: true, // Keep refreshing even when tab is not active
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/menu-items'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/menu-items');
      return response.json();
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    refetchIntervalInBackground: true,
  });

  const { data: allTables = [] } = useQuery({
    queryKey: ['/api/tables'],
    queryFn: async () => {
      const response = await fetch('/api/tables');
      return response.json();
    },
    refetchInterval: 3000, // Auto-refresh every 3 seconds to sync with orders
    refetchIntervalInBackground: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest('PATCH', `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidar e forçar refetch imediato para atualização instantânea
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === '/api/tables' 
      });
      queryClient.refetchQueries({ queryKey: ['/api/orders'] });
      queryClient.refetchQueries({ predicate: (query) => 
        query.queryKey[0] === '/api/tables' 
      });
      
      // Atualizar o pedido selecionado se for o mesmo
      if (selectedOrder && selectedOrder.id === variables.orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: variables.status } : null);
      }
      
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do pedido",
        variant: "destructive",
      });
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiRequest('DELETE', `/api/orders/${orderId}`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidar e forçar refetch imediato para atualização instantânea
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === '/api/tables' 
      });
      queryClient.refetchQueries({ queryKey: ['/api/orders'] });
      queryClient.refetchQueries({ predicate: (query) => 
        query.queryKey[0] === '/api/tables' 
      });
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
      toast({
        title: "Sucesso",
        description: "Pedido removido com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao remover pedido",
        variant: "destructive",
      });
    }
  });

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await apiRequest('GET', `/api/orders/${orderId}`);
      const orderDetails = await response.json();
      setSelectedOrder(orderDetails);
      setIsOrderModalOpen(true);
      setAdminNotes(orderDetails.adminNotes || '');
      setEstimatedTime(orderDetails.estimatedDeliveryTime || '');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao buscar detalhes do pedido",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = (status: string) => {
    if (!selectedOrder) return;
    updateStatusMutation.mutate({ orderId: selectedOrder.id, status });
  };

  const handleDeleteOrder = () => {
    if (!selectedOrder) return;
    if (confirm('Tem certeza que deseja remover este pedido? Esta ação não pode ser desfeita.')) {
      deleteOrderMutation.mutate(selectedOrder.id);
    }
  };

  const shareOrderOnWhatsApp = () => {
    if (!selectedOrder) return;
    
    const orderDetails = `
*Pedido Las Tortillas #${selectedOrder.id}*

*Cliente:* ${selectedOrder.customerName}
*Telefone:* ${selectedOrder.customerPhone}
*Status:* ${getStatusText(selectedOrder.status)}
*Tipo:* ${getOrderTypeText(selectedOrder.orderType)}
*Local:* ${getLocationName(selectedOrder.locationId)}
${selectedOrder.orderType === 'dine-in' && selectedOrder.tableId ? `*Mesa:* ${getTableInfo(selectedOrder.tableId)}` : ''}
*Total:* ${selectedOrder.totalAmount} AOA

*Itens:*
${selectedOrder.items?.map(item => `• ${getMenuItemName(item.menuItemId)} (${item.quantity}x) - ${item.itemPrice} AOA`).join('\n')}

*Entrega estimada:* ${selectedOrder.estimatedDeliveryTime || 'A definir'}
${selectedOrder.deliveryAddress ? `*Endereço:* ${selectedOrder.deliveryAddress}` : ''}
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getMenuItemName = (menuItemId: number) => {
    const item = menuItems.find((item: MenuItem) => item.id === menuItemId);
    return item ? item.name : `Item #${menuItemId}`;
  };

  const getTableInfo = (tableId: number | null) => {
    if (!tableId) return null;
    const table = allTables.find(t => t.id === tableId);
    return table ? `Mesa ${table.number} (${table.capacity} pessoas)` : `Mesa #${tableId}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Painel de ações rápidas do admin */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Ações Rápidas Admin
              </h2>
              <p className="text-green-100 text-sm">Acesso direto às principais funcionalidades</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <a
                href="/menu"
                className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                <span className="text-lg">🛒</span>
                Novo Pedido
              </a>
              
              <button
                onClick={() => {
                  // Mostrar apenas pedidos pendentes para ação rápida
                  setSelectedStatus('received');
                  setSelectedLocation('all');
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                <span className="text-lg">🔔</span>
                Pendentes
              </button>
              
              <button
                onClick={() => {
                  // Mostrar apenas pedidos prontos
                  setSelectedStatus('ready');
                  setSelectedLocation('all');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                <span className="text-lg">✅</span>
                Prontos
              </button>
              
              <button
                onClick={() => {
                  // Reset filtros para ver todos
                  setSelectedStatus('all');
                  setSelectedLocation('all');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                <span className="text-lg">📊</span>
                Ver Todos
              </button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Gestão de Pedidos</h1>
            <button
              onClick={() => refetch()}
              className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Atualizar
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base w-full"
            >
              <option value="all">Todos os Status</option>
              <option value="received">Recebido</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Pronto</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base w-full"
            >
              <option value="all">Todas as Localizações</option>
              <option value="ilha">Las Tortillas Ilha</option>
              <option value="talatona">Las Tortillas Talatona</option>
              <option value="movel">Las Tortillas Móvel</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus !== 'all' || selectedLocation !== 'all' 
                ? 'Nenhum pedido encontrado com os filtros aplicados.' 
                : 'Ainda não há pedidos no sistema.'}
            </p>
            <a 
              href="/menu" 
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Fazer Primeiro Pedido
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {orders.map((order: Order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => fetchOrderDetails(order.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Localização:</span>
                  <span className="text-sm font-medium">{getLocationName(order.locationId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <span className="text-sm font-medium">{getOrderTypeText(order.orderType)}</span>
                </div>
                {order.orderType === 'dine-in' && order.tableId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mesa:</span>
                    <span className="text-sm font-medium text-blue-600">{getTableInfo(order.tableId)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-sm font-bold text-red-600">{order.totalAmount} AOA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data:</span>
                  <span className="text-sm">{new Date(order.createdAt!).toLocaleString('pt-AO')}</span>
                </div>
              </div>

              {/* Clique para ver detalhes */}
              <div className="text-sm text-gray-500 mt-2">
                Clique para ver detalhes e gerenciar pedido
              </div>
            </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Pedido #{selectedOrder.id}</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Informações do Cliente</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Nome:</p>
                          <p className="font-medium">{selectedOrder.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Telefone:</p>
                          <p className="font-medium">{selectedOrder.customerPhone}</p>
                        </div>
                        {selectedOrder.customerEmail && (
                          <div>
                            <p className="text-sm text-gray-600">Email:</p>
                            <p className="font-medium">{selectedOrder.customerEmail}</p>
                          </div>
                        )}
                        {selectedOrder.deliveryAddress && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Endereço:</p>
                            <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{getMenuItemName(item.menuItemId)}</p>
                            {item.customizations && item.customizations.length > 0 && (
                              <p className="text-sm text-gray-600">
                                Personalizações: {item.customizations.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.quantity}x {item.unitPrice} AOA</p>
                            <p className="text-sm text-gray-600">= {item.subtotal} AOA</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Resumo do Pedido</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Status:</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusText(selectedOrder.status)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Localização:</p>
                          <p className="font-medium">{getLocationName(selectedOrder.locationId)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tipo:</p>
                          <p className="font-medium">{getOrderTypeText(selectedOrder.orderType)}</p>
                        </div>
                        {selectedOrder.orderType === 'dine-in' && selectedOrder.tableId && (
                          <div>
                            <p className="text-sm text-gray-600">Mesa:</p>
                            <p className="font-medium text-blue-600">{getTableInfo(selectedOrder.tableId)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Tipo:</p>
                          <p className="font-medium">{getOrderTypeText(selectedOrder.orderType)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pagamento:</p>
                          <p className="font-medium">{selectedOrder.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total:</p>
                          <p className="text-xl font-bold text-red-600">{selectedOrder.totalAmount} AOA</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Data:</p>
                          <p className="font-medium">{new Date(selectedOrder.createdAt!).toLocaleString('pt-AO')}</p>
                        </div>
                      </div>
                      {selectedOrder.notes && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">Observações:</p>
                          <p className="font-medium">{selectedOrder.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Administrative Actions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ações Administrativas</h3>
                    
                    {/* Status Update */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                      <button
                        onClick={() => handleStatusUpdate('received')}
                        disabled={selectedOrder.status === 'received' || updateStatusMutation.isPending}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                          selectedOrder.status === 'received' 
                            ? 'bg-blue-100 text-blue-800 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Recebido
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate('preparing')}
                        disabled={selectedOrder.status === 'preparing' || updateStatusMutation.isPending}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                          selectedOrder.status === 'preparing' 
                            ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed' 
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Preparando
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate('ready')}
                        disabled={selectedOrder.status === 'ready' || updateStatusMutation.isPending}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                          selectedOrder.status === 'ready' 
                            ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Pronto
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate('delivered')}
                        disabled={selectedOrder.status === 'delivered' || updateStatusMutation.isPending}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                          selectedOrder.status === 'delivered' 
                            ? 'bg-gray-100 text-gray-800 cursor-not-allowed' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        Entregue
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate('cancelled')}
                        disabled={selectedOrder.status === 'cancelled' || updateStatusMutation.isPending}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                          selectedOrder.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800 cursor-not-allowed' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>

                    {/* Additional Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => window.open(`tel:${selectedOrder.customerPhone}`, '_self')}
                        className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Ligar Cliente
                      </button>
                      
                      <button
                        onClick={shareOrderOnWhatsApp}
                        className="flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                      </button>
                      
                      <button
                        onClick={handleDeleteOrder}
                        disabled={deleteOrderMutation.isPending}
                        className="flex items-center justify-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteOrderMutation.isPending ? 'Removendo...' : 'Remover Pedido'}
                      </button>
                    </div>

                    {/* Estimated Time Update */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tempo Estimado de Entrega
                        </label>
                        <input
                          type="text"
                          value={estimatedTime}
                          onChange={(e) => setEstimatedTime(e.target.value)}
                          placeholder="Ex: 30-45 minutos"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          // TODO: Add API call to update estimated time
                          toast({
                            title: "Funcionalidade em desenvolvimento",
                            description: "Atualização de tempo estimado será implementada em breve",
                          });
                        }}
                        className="mt-7 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Atualizar
                      </button>
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas Administrativas
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Adicione observações internas sobre este pedido..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={() => {
                          // TODO: Add API call to save admin notes
                          toast({
                            title: "Funcionalidade em desenvolvimento",
                            description: "Salvamento de notas administrativas será implementado em breve",
                          });
                        }}
                        className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Salvar Notas
                      </button>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end pt-4 border-t">
                      <button
                        onClick={() => {
                          setSelectedOrder(null);
                          setIsOrderModalOpen(false);
                        }}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}