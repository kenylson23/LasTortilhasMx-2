import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-items');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.slice(0, 6)); // Mostrar apenas 6 itens na página inicial
      }
    } catch (error) {
      console.error('Erro ao carregar itens do menu:', error);
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

  return (
    <>
      <Head>
        <title>Las Tortillas Mexican Grill - Restaurante Mexicano em Luanda</title>
        <meta 
          name="description" 
          content="O único restaurante mexicano com ambiente 100% familiar em Luanda. Sabores autênticos do México desde 2018." 
        />
        <meta name="keywords" content="restaurante mexicano, luanda, angola, tacos, quesadillas, burritos, comida mexicana" />
        <meta property="og:title" content="Las Tortillas Mexican Grill - Restaurante Mexicano em Luanda" />
        <meta property="og:description" content="O único restaurante mexicano com ambiente 100% familiar em Luanda. Sabores autênticos do México desde 2018." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-mexican-cream to-white">
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

        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-mexican-green mb-6 animate-fade-in">
                Bienvenidos a Las Tortillas!
              </h2>
              <p className="text-xl text-gray-700 mb-8 animate-slide-up">
                O único restaurante mexicano com ambiente 100% familiar em Luanda
              </p>
              <p className="text-lg text-gray-600 mb-10 animate-slide-up">
                Quer passar o dia com a família? É no Las Tortillas
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link 
                  href="/menu" 
                  className="btn btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
                >
                  Ver Menu Completo
                </Link>
                <a 
                  href="https://wa.me/244949639932" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
                >
                  Fazer Reserva
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Preview */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-mexican-green mb-4">
                Nossos Pratos Especiais
              </h3>
              <p className="text-lg text-gray-700">
                Sabores autênticos do México preparados com ingredientes frescos
              </p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mexican-green mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando pratos especiais...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((item) => (
                  <div key={item.id} className="card p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-6xl">🌮</span>
                      )}
                    </div>
                    <h4 className="text-xl font-semibold text-mexican-green mb-2">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {item.description}
                    </p>
                    <p className="text-accent-orange font-bold text-lg">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link 
                href="/menu" 
                className="btn btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Ver Menu Completo
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-mexican-green mb-8">
                Desde 2018 em Luanda
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Fundado em 14 de fevereiro de 2018, o Las Tortillas Mexican Grill 
                estabeleceu-se como o destino gastronômico mexicano de referência em Luanda.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Com mais de 6 anos de experiência, oferecemos sabores autênticos do México 
                num ambiente 100% familiar, perfeito para momentos especiais com quem mais importa.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏠</div>
                  <h4 className="text-xl font-semibold text-mexican-green mb-2">
                    Ambiente Familiar
                  </h4>
                  <p className="text-gray-600">
                    Espaço acolhedor e seguro para toda a família
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">🌮</div>
                  <h4 className="text-xl font-semibold text-mexican-green mb-2">
                    Sabores Autênticos
                  </h4>
                  <p className="text-gray-600">
                    Receitas tradicionais mexicanas preparadas com amor
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">⭐</div>
                  <h4 className="text-xl font-semibold text-mexican-green mb-2">
                    6+ Anos de Experiência
                  </h4>
                  <p className="text-gray-600">
                    Tradição e qualidade desde 2018
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-mexican-green text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-8">Entre em Contato</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h4 className="text-xl font-semibold mb-4">Localização</h4>
                  <p className="text-mexican-cream">
                    Ilha de Luanda, Luanda, Angola
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4">Horário de Funcionamento</h4>
                  <p className="text-mexican-cream">
                    Segunda a Quinta: 11:00 - 23:00<br />
                    Sexta a Domingo: 11:00 - 01:00
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-4">Reservas e Informações</h4>
                <a 
                  href="https://wa.me/244949639932" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
                >
                  <span>📱</span>
                  WhatsApp: +244 949 639 932
                </a>
              </div>
            </div>
          </div>
        </section>

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