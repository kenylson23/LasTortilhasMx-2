import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { staticMenuItems, MenuItem } from "../data/staticMenu";

export default function SimpleMenuShowcase() {
  // Try to fetch from API, fallback to static data
  const { data: apiMenuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
    retry: false, // Don't retry on failure during development
  });

  // Use API data if available, otherwise use static data
  const menuItems = apiMenuItems && apiMenuItems.length > 0 ? apiMenuItems : staticMenuItems;

  // Show only featured items (first 6 available items)
  const featuredItems = menuItems.filter(item => item.available).slice(0, 6);

  if (isLoading) {
    return (
      <section id="menu" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos <span className="text-red-600">Pratos Especiais</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sabores autênticos do México preparados com ingredientes frescos e muito amor
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos <span className="text-red-600">Pratos Especiais</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sabores autênticos do México preparados com ingredientes frescos e muito amor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-600">
                      {Number(item.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                    <a 
                      href="/menu"
                      className="bg-green-700 text-white px-3 sm:px-4 py-2 rounded-full hover:bg-green-800 transition-colors transform hover:scale-105 text-sm sm:text-base inline-block"
                    >
                      Pedir
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/menu"
              className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6m10 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="hidden sm:inline">Pedir Online</span>
              <span className="sm:hidden">Pedir</span>
            </a>
            <button 
              onClick={() => {
                const message = encodeURIComponent('Olá! Gostaria de ver o menu completo do Las Tortillas Mexican Grill.');
                window.location.href = `https://wa.me/244949639932?text=${message}`;
              }}
              className="bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Ver Menu Completo</span>
              <span className="sm:hidden">Menu Completo</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}