import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    orderType: 'delivery',
    items: [],
    totalAmount: 0,
    paymentMethod: 'cash',
    notes: ''
  });
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'received': return 'Recebido';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
        const createdOrder = await response.json();
        setOrders([createdOrder, ...orders]);
        setNewOrder({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          deliveryAddress: '',
          orderType: 'delivery',
          items: [],
          totalAmount: 0,
          paymentMethod: 'cash',
          notes: ''
        });
        setShowNewOrderForm(false);
        alert('Pedido criado com sucesso!');
      } else {
        throw new Error('Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar pedido');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Head>
        <title>Pedidos - Las Tortillas Mexican Grill</title>
        <meta 
          name="description" 
          content="Gerencie seus pedidos no Las Tortillas Mexican Grill. Acompanhe o status dos pedidos e faça novos pedidos." 
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-mexican-green text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-orange rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">🌮</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Las Tortillas</h1>
                  <p className="text-sm opacity-90">Mexican Grill</p>
                </div>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="hover:text-accent-orange transition-colors">
                  Início
                </Link>
                <Link href="/menu" className="hover:text-accent-orange transition-colors">
                  Menu
                </Link>
                <Link href="/pedidos" className="text-accent-orange">
                  Pedidos
                </Link>
                <Link href="/admin" className="hover:text-accent-orange transition-colors">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Page Title */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-bold text-mexican-green mb-4">
                  Pedidos
                </h2>
                <p className="text-lg text-gray-700">
                  Gerencie e acompanhe todos os pedidos
                </p>
              </div>
              <button
                onClick={() => setShowNewOrderForm(true)}
                className="btn btn-primary px-6 py-3"
              >
                Novo Pedido
              </button>
            </div>
          </div>
        </div>

        {/* New Order Form Modal */}
        {showNewOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-mexican-green">
                    Novo Pedido
                  </h3>
                  <button
                    onClick={() => setShowNewOrderForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Cliente
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={newOrder.customerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={newOrder.customerPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={newOrder.customerEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Pedido
                      </label>
                      <select
                        name="orderType"
                        value={newOrder.orderType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                      >
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Retirada</option>
                        <option value="dine-in">No Local</option>
                      </select>
                    </div>
                  </div>
                  
                  {newOrder.orderType === 'delivery' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço de Entrega
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={newOrder.deliveryAddress}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Total (AOA)
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={newOrder.totalAmount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pagamento
                    </label>
                    <select
                      name="paymentMethod"
                      value={newOrder.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                    >
                      <option value="cash">Dinheiro</option>
                      <option value="card">Cartão</option>
                      <option value="transfer">Transferência</option>
                      <option value="multicaixa">Multicaixa</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      name="notes"
                      value={newOrder.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                      placeholder="Observações especiais sobre o pedido..."
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                    >
                      Criar Pedido
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewOrderForm(false)}
                      className="btn btn-outline flex-1"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mexican-green mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando pedidos...</p>
            </div>
          ) : (
            <>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">
                    Nenhum pedido encontrado
                  </p>
                  <button
                    onClick={() => setShowNewOrderForm(true)}
                    className="btn btn-primary"
                  >
                    Criar Primeiro Pedido
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <div key={order.id} className="card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-mexican-green">
                            Pedido #{order.id}
                          </h3>
                          <p className="text-gray-600">{order.customerName}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <p className="text-lg font-bold text-mexican-green mt-2">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Telefone:</strong> {order.customerPhone}</p>
                          <p><strong>Tipo:</strong> {order.orderType}</p>
                          <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
                        </div>
                        <div>
                          {order.deliveryAddress && (
                            <p><strong>Endereço:</strong> {order.deliveryAddress}</p>
                          )}
                          {order.notes && (
                            <p><strong>Observações:</strong> {order.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-mexican-green text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Precisa de ajuda com pedidos?
            </h3>
            <p className="text-lg mb-6">
              Entre em contato conosco pelo WhatsApp para suporte
            </p>
            <a 
              href="https://wa.me/244949639932" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary px-8 py-3 inline-flex items-center gap-2"
            >
              <span>📱</span>
              WhatsApp: +244 949 639 932
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 bg-accent-orange rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">🌮</span>
                </div>
                <span className="text-lg font-semibold">Las Tortillas Mexican Grill</span>
              </div>
              <p className="text-gray-400 mb-4">
                Sabores autênticos do México desde 2018
              </p>
              <p className="text-gray-400 text-sm">
                © 2024 Las Tortillas Mexican Grill. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}