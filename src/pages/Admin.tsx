import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';
import OrderManagement from '../components/OrderManagement';
import MenuManagement from '../components/MenuManagement';
import OrderStats from '../components/OrderStats';
import TableManagement from '../components/TableManagement';
import { RefreshCw } from 'lucide-react';

export default function Admin() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('orders');
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
          {/* Banner de acesso à cozinha */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👨‍🍳</span>
              <div>
                <h3 className="font-bold">Acesso Rápido à Cozinha</h3>
                <p className="text-sm opacity-90">Gerencie pedidos em tempo real</p>
              </div>
            </div>
            <button
              onClick={() => setLocation('/cozinha')}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-50 transition-colors"
            >
              IR PARA COZINHA
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Painel Admin</h1>
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">Auto-refresh ativo</span>
                  <span className="sm:hidden">Live</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Gestão Las Tortillas • Dados em tempo real</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
              {/* Acesso rápido ao sistema de pedidos */}
              <button
                onClick={() => setLocation('/menu')}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2 shadow-md min-w-0"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">Fazer Pedido</span>
                <span className="sm:hidden">Pedido</span>
              </button>
              
              {/* Botão da cozinha mais visível */}
              <button
                onClick={() => setLocation('/cozinha')}
                className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-2 shadow-md min-w-0 border-2 border-orange-400"
                title="Acessar Painel da Cozinha"
              >
                <span>👨‍🍳</span>
                <span className="hidden sm:inline font-bold">COZINHA</span>
                <span className="sm:hidden font-bold">CHEF</span>
              </button>
              
              <button
                onClick={() => setLocation('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm px-2"
              >
                <span className="hidden sm:inline">Voltar ao Site</span>
                <span className="sm:hidden">Site</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pedidos
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'tables'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mesas
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Relatórios
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'tables' && <TableManagement />}
        {activeTab === 'analytics' && <OrderStats />}
      </div>
    </div>
  );
}