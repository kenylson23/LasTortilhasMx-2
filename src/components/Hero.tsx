import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import heroImage from "@assets/From tortillas with Love   photo credit @andersson_samd_1751272348650.jpg";
import LoadingSpinner from "./LoadingSpinner";

export default function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Preload otimizado da imagem do hero
  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true); // Considerar como carregado mesmo com erro
    };
    
    // Configurar para carregamento prioritário
    img.fetchPriority = 'high';
    img.loading = 'eager';
    img.src = heroImage;
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image com loading otimizado */}
      <div 
        className={`absolute inset-0 parallax-bg transition-opacity duration-500 ${
          imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          willChange: 'opacity'
        }}
      />
      
      {/* Placeholder gradient enquanto a imagem carrega */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-lg font-medium">Carregando...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback para erro de imagem */}
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700">
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 sm:bg-black/30" />
      
      {/* Additional gradient overlay for text area */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent sm:from-black/40 lg:via-transparent" />
      
      <div className="relative z-10 text-center px-2 sm:px-4 lg:px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-16 sm:py-20">
        {/* Content without card */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6"
            style={{
              textShadow: '4px 4px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.6), 0px 0px 20px rgba(0,0,0,0.5)'
            }}
          >
            <div className="flex flex-col space-y-1 sm:space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:justify-start text-center lg:text-left">
              <span className="text-green-300" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7)' }}>Las Tortillas</span>
              <span className="text-red-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl lg:ml-4" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.7)' }}>Mexican Grill</span>
            </div>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6 font-light"
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
            className="text-base sm:text-lg text-white mb-6 sm:mb-8"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6), 0px 0px 10px rgba(0,0,0,0.4)'
            }}
          >
            3 formas de desfrutar da autêntica culinária mexicana em Luanda. Pratos tradicionais que toda a família vai adorar.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center sm:items-start"
          >
            <button 
              onClick={() => scrollToSection("#menu")}
              className="bg-red-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl border-2 border-red-500 min-w-[160px] sm:min-w-[180px]"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ver Menu
            </button>
            
            <button 
              onClick={() => scrollToSection("#contato")}
              className="border-2 border-green-400 text-green-400 bg-white/10 backdrop-blur-sm px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-green-400 hover:text-white transition-all duration-300 flex items-center justify-center shadow-2xl min-w-[160px] sm:min-w-[180px]"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Fazer Reserva
            </button>
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
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-4 md:left-10"
      >
        <div className="w-16 h-16 bg-orange-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-orange-500/30">
          <svg className="w-8 h-8 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, -10, 0], x: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-20 right-4 md:right-10"
      >
        <div className="w-20 h-20 bg-green-700/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-700/30">
          <svg className="w-10 h-10 text-green-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </motion.div>
      
      {/* Additional floating element for mobile */}
      <motion.div 
        animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 right-4 lg:hidden"
      >
        <div className="w-12 h-12 bg-red-600/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-600/30">
          <svg className="w-6 h-6 text-red-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 3V1a1 1 0 012 0v2a10 10 0 018 8 10 10 0 01-8 8v2a1 1 0 01-2 0v-2a10 10 0 01-8-8 10 10 0 018-8z"/>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
