import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/pages/_app';
import { useRouter } from 'next/router';

export default function Admin() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && user.role === 'admin') {
      fetchAllData();
    }
  }, [user, loading]);

  const fetchAllData = async () => {
    try {
      const [menuRes, ordersRes, reservationsRes, tablesRes] = await Promise.all([
        fetch('/api/menu-items'),
        fetch('/api/orders'),
        fetch('/api/reservations'),
        fetch('/api/tables')
      ]);

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json();
        setReservations(reservationsData);
      }

      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        setTables(tablesData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
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

  const getOrderStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );
    
    return {
      total: orders.length,
      today: todayOrders.length,
      pending: orders.filter(o => o.status === 'received').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      revenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        const response = await fetch('/api/menu-items', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: itemId })
        });

        if (response.ok) {
          setMenuItems(menuItems.filter(item => item.id !== itemId));
        }
      } catch (error) {
        console.error('Erro ao excluir item:', error);
      }
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mexican-green"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">
            Você precisa ser administrador para acessar esta página
          </p>
          <Link href="/login" className="btn btn-primary">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <>
      <Head>
        <title>Painel Admin - Las Tortillas Mexican Grill</title>
        <meta name="description" content="Painel administrativo para gerenciar pedidos, menu e reservas." />
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
                  <h1 className="text-2xl font-bold">Las Tortillas - Admin</h1>
                  <p className="text-sm opacity-90">Painel Administrativo</p>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm">Bem-vindo, {user.name}</span>
                <Link href="/login" className="btn btn-outline text-white border-white hover:bg-white hover:text-mexican-green">
                  Sair
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-mexican-green text-mexican-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-mexican-green text-mexican-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pedidos ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'menu'
                    ? 'border-mexican-green text-mexican-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'reservations'
                    ? 'border-mexican-green text-mexican-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reservas
              </button>
              <button
                onClick={() => setActiveTab('tables')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'tables'
                    ? 'border-mexican-green text-mexican-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Mesas
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold text-mexican-green mb-8">
                Dashboard
              </h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Pedidos Hoje
                  </h3>
                  <p className="text-3xl font-bold text-mexican-green">
                    {stats.today}
                  </p>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Pedidos Pendentes
                  </h3>
                  <p className="text-3xl font-bold text-accent-orange">
                    {stats.pending}
                  </p>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Total de Pedidos
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.total}
                  </p>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Receita Total
                  </h3>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(stats.revenue)}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Pedidos Recentes
                </h3>
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-3xl font-bold text-mexican-green mb-8">
                Gerenciar Pedidos
              </h2>
              
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Pedido #{order.id}
                        </h3>
                        <p className="text-gray-600">{order.customerName}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-mexican-green">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.orderType}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'received')}
                        className={`px-3 py-1 rounded text-sm ${
                          order.status === 'received' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Recebido
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className={`px-3 py-1 rounded text-sm ${
                          order.status === 'preparing' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Preparando
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className={`px-3 py-1 rounded text-sm ${
                          order.status === 'ready' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Pronto
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className={`px-3 py-1 rounded text-sm ${
                          order.status === 'delivered' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Entregue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-mexican-green">
                  Gerenciar Menu
                </h2>
                <Link href="/admin/menu/new" className="btn btn-primary">
                  Adicionar Item
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="card p-4">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-4xl">🌮</span>
                      )}
                    </div>
                    <h4 className="font-semibold mb-2">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="font-bold text-mexican-green mb-3">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/menu/edit/${item.id}`}
                        className="btn btn-outline text-sm flex-1"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="btn bg-red-600 text-white hover:bg-red-700 text-sm flex-1"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div>
              <h2 className="text-3xl font-bold text-mexican-green mb-8">
                Reservas
              </h2>
              
              <div className="grid gap-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="card p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {reservation.name}
                        </h3>
                        <p className="text-gray-600">{reservation.phone}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(reservation.dateTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {reservation.guests} pessoas
                        </p>
                        <p className="text-sm text-gray-600">
                          {reservation.email}
                        </p>
                      </div>
                    </div>
                    {reservation.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Observações:</strong> {reservation.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tables Tab */}
          {activeTab === 'tables' && (
            <div>
              <h2 className="text-3xl font-bold text-mexican-green mb-8">
                Mesas
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables.map((table) => (
                  <div 
                    key={table.id} 
                    className={`card p-4 text-center ${
                      table.status === 'available' 
                        ? 'border-green-500' 
                        : 'border-red-500'
                    }`}
                  >
                    <h4 className="font-semibold mb-2">
                      Mesa {table.number}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {table.seats} lugares
                    </p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      table.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {table.status === 'available' ? 'Disponível' : 'Ocupada'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}