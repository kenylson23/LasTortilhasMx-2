import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-items');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Erro ao carregar menu:', error);
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

  const categories = [...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addToCart = (item) => {
    // Implementar lógica do carrinho
    alert(`${item.name} adicionado ao carrinho!`);
  };

  return (
    <>
      <Head>
        <title>Menu - Las Tortillas Mexican Grill</title>
        <meta 
          name="description" 
          content="Explore nosso menu completo com tacos, quesadillas, burritos e muito mais. Sabores autênticos do México em Luanda." 
        />
        <meta name="keywords" content="menu, tacos, quesadillas, burritos, comida mexicana, luanda" />
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
                <Link href="/menu" className="text-accent-orange">
                  Menu
                </Link>
                <Link href="/pedidos" className="hover:text-accent-orange transition-colors">
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
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-mexican-green mb-4">
              Nosso Menu
            </h2>
            <p className="text-lg text-gray-700">
              Sabores autênticos do México preparados com ingredientes frescos
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border-b py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar pratos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mexican-green"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all' 
                      ? 'bg-mexican-green text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todos
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === category 
                        ? 'bg-mexican-green text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mexican-green mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando menu...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🌮</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-semibold text-mexican-green">
                        {item.name}
                      </h4>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {item.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-accent-orange font-bold text-xl">
                        {formatPrice(item.price)}
                      </p>
                      <button
                        onClick={() => addToCart(item)}
                        className="btn btn-primary px-4 py-2 text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                    
                    {!item.available && (
                      <p className="text-red-500 text-sm mt-2">
                        Temporariamente indisponível
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Nenhum prato encontrado com os filtros selecionados.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-mexican-green text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para fazer seu pedido?
            </h3>
            <p className="text-lg mb-6">
              Entre em contato conosco para delivery ou reservas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/pedidos" 
                className="btn btn-secondary px-8 py-3 inline-flex items-center justify-center"
              >
                Fazer Pedido
              </Link>
              <a 
                href="https://wa.me/244949639932" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline text-white border-white hover:bg-white hover:text-mexican-green px-8 py-3 inline-flex items-center justify-center"
              >
                WhatsApp
              </a>
            </div>
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