import { motion } from "framer-motion";
import { memo, useCallback } from "react";
const heroImage = "/images/hero-desktop.webp";

// Componente memo para elementos flutuantes
const FloatingElement = memo(({ 
  className, 
  children, 
  animate, 
  transition 
}: { 
  className: string; 
  children: React.ReactNode; 
  animate: any; 
  transition: any; 
}) => (
  <motion.div 
    animate={animate}
    transition={transition}
    className={className}
  >
    {children}
  </motion.div>
));

FloatingElement.displayName = 'FloatingElement';

// Componente memo para botões
const HeroButton = memo(({ 
  onClick, 
  className, 
  children, 
  icon 
}: { 
  onClick: () => void; 
  className: string; 
  children: React.ReactNode; 
  icon: React.ReactNode; 
}) => (
  <button 
    onClick={onClick}
    className={className}
  >
    {icon}
    {children}
  </button>
));

HeroButton.displayName = 'HeroButton';

export default function OptimizedHero() {
  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image otimizada */}
      <div 
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform'
        }}
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent lg:block hidden" />
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-20">
        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:text-left"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{
              textShadow: '4px 4px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.6), 0px 0px 20px rgba(0,0,0,0.5)'
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start text-center lg:text-left">
              <span className="text-green-300" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7)' }}>Las Tortillas</span>
              <span className="text-red-400 text-2xl md:text-4xl lg:text-5xl lg:ml-4 mt-2 lg:mt-0" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7)' }}>Mexican Grill</span>
            </div>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-white mb-6 font-light"
            style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.8), 1px 1px 3px rgba(0,0,0,0.6), 0px 0px 15px rgba(0,0,0,0.4)'
            }}
          >
            Quer passar o dia com a família? É no Las Tortillas
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg text-white mb-8"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6), 0px 0px 10px rgba(0,0,0,0.4)'
            }}
          >
            O único restaurante mexicano com ambiente 100% familiar em Luanda. Pratos tradicionais que toda a família vai adorar.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center sm:items-start"
          >
            <HeroButton
              onClick={() => scrollToSection("#menu")}
              className="bg-red-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl border-2 border-red-500 min-w-[160px] sm:min-w-[180px]"
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Ver Menu
            </HeroButton>
            
            <HeroButton
              onClick={() => scrollToSection("#contato")}
              className="border-2 border-green-400 text-green-400 bg-white/10 backdrop-blur-sm px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-green-400 hover:text-white transition-all duration-300 flex items-center justify-center shadow-2xl min-w-[160px] sm:min-w-[180px]"
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            >
              Fazer Reserva
            </HeroButton>
          </motion.div>
        </motion.div>

        {/* Right Column - Visual Space for Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="relative">
            {/* Decorative Card highlighting the restaurant */}
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 bg-orange-500/30 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Ambiente Autêntico</h3>
                <p className="text-lg opacity-90">Viva a experiência mexicana completa</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Elements otimizados */}
      <FloatingElement
        className="absolute top-20 left-4 md:left-10"
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 bg-orange-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-orange-500/30">
          <svg className="w-8 h-8 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </FloatingElement>
      
      <FloatingElement
        className="absolute bottom-20 right-4 md:right-10"
        animate={{ y: [0, -10, 0], x: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <div className="w-20 h-20 bg-green-700/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-700/30">
          <svg className="w-10 h-10 text-green-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </FloatingElement>
      
      <FloatingElement
        className="absolute top-1/3 right-4 lg:hidden"
        animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="w-12 h-12 bg-red-600/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-600/30">
          <svg className="w-6 h-6 text-red-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 3V1a1 1 0 012 0v2a10 10 0 018 8 10 10 0 01-8 8v2a1 1 0 01-2 0v-2a10 10 0 01-8-8 10 10 0 018-8z"/>
          </svg>
        </div>
      </FloatingElement>
    </section>
  );
}