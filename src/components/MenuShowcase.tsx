import { motion } from "framer-motion";
import { MENU_ITEMS } from "../lib/constants";
import ScrollReveal from "./ScrollReveal";
import LazyImage from "./LazyImage";
import { memo } from "react";

// Componente memo para item do menu
const MenuItemCard = memo(({ item, index }: { item: typeof MENU_ITEMS[0], index: number }) => {
  const handleOrderItem = (itemName: string) => {
    // Simple alert for static deployment
    alert(`${itemName} - Entre em contato via WhatsApp para fazer seu pedido!`);
  };

  return (
    <ScrollReveal
      key={item.id}
      direction="up"
      delay={0.1}
      stagger={true}
      staggerIndex={index}
      staggerDelay={0.15}
      duration={0.6}
    >
      <div className="menu-item bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <LazyImage
            src={item.image}
            alt={item.name}
            className="w-full h-40 sm:h-48 transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">{item.description}</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <span className="text-xl sm:text-2xl font-bold text-red-600">{item.price}</span>
            <button 
              onClick={() => handleOrderItem(item.name)}
              className="w-full sm:w-auto bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base"
            >
              Pedir
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
});

MenuItemCard.displayName = 'MenuItemCard';

export default function MenuShowcase() {

  return (
    <section id="menu" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <ScrollReveal 
          direction="up"
          delay={0.2}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nosso Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pratos autênticos que transportam você direto para o México
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {MENU_ITEMS.map((item, index) => (
            <MenuItemCard key={item.id} item={item} index={index} />
          ))}
        </div>

        <ScrollReveal 
          direction="up"
          delay={0.8}
          duration={0.6}
          className="text-center mt-12"
        >
          <button className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Menu Completo
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
