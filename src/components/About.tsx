import { motion } from "framer-motion";

export default function About() {
  const stats = [
    { number: "7+", label: "Anos de Experiência" },
    { number: "50+", label: "Pratos no Menu" },
    { number: "5000+", label: "Clientes Satisfeitos" },
  ];

  return (
    <section id="sobre" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Nossa História
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Las Tortillas Mexican Grill nasceu do sonho de trazer os autênticos sabores mexicanos para Luanda. 
              Fundado em 14 de Fevereiro de 2018, somos um restaurante familiar que se dedica a preparar cada prato 
              com ingredientes frescos e receitas tradicionais passadas de geração em geração.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Há mais de 7 anos localizado na bela Ilha de Luanda, oferecemos uma experiência gastronómica única, 
              combinando a hospitalidade angolana com a paixão pela culinária mexicana. Nossa história começou 
              no Dia dos Namorados, simbolizando o amor que dedicamos à nossa culinária e aos nossos clientes.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.2) }}
                  viewport={{ once: true }}
                  className="text-center min-w-[100px]"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl shadow-2xl w-full h-auto overflow-hidden">
              <img 
                src="/images/restaurant-ambiente.jpg?v=1" 
                alt="Clientes felizes no Las Tortillas Mexican Grill - ambiente familiar e acolhedor com chapéus mexicanos" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="lazy"
                style={{ 
                  maxHeight: '600px', 
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  console.error('Error loading image:', e);
                  // Fallback to a working image
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-lg font-semibold">Ambiente acolhedor e familiar</p>
                <p className="text-sm opacity-90">Venha conhecer nosso espaço!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
