import { motion } from "framer-motion";
import { useState } from "react";
import LocationModal from "./LocationModal";

interface LocationData {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  specialties: string[];
  images: string[];
  features: string[];
  shortDescription: string;
}

export default function OurLocations() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const locations: LocationData[] = [
    {
      id: "ilha-luanda",
      name: "Las Tortillas Ilha",
      type: "Restaurante Principal",
      shortDescription: "Nosso restaurante original na bela Ilha de Luanda, onde tudo começou em 2018.",
      description: "Nosso restaurante principal localizado na icônica Ilha de Luanda, onde nossa história começou em 14 de Fevereiro de 2018. Este espaço oferece uma experiência gastronômica completa com vista para a baía, ambiente climatizado e uma atmosfera que combina perfeitamente a hospitalidade angolana com a autenticidade mexicana.",
      address: "Ilha de Luanda, Luanda - Angola",
      phone: "+244 949 639 932",
      hours: "Segunda-Quinta: 11:00-23:00 | Sexta-Domingo: 11:00-01:00",
      specialties: ["Tacos Tradicionais", "Burritos Especiais", "Margaritas", "Nachos Supreme"],
      images: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      ],
      features: ["Ar Condicionado", "Vista para a Baía", "Wi-Fi Gratuito", "Estacionamento", "Área Kids", "Música ao Vivo"]
    },
    {
      id: "segunda-localizacao",
      name: "Las Tortillas Talatona",
      type: "Restaurante Filial",
      shortDescription: "Nossa segunda localização em Talatona, mais perto de você.",
      description: "Nossa segunda localização estrategicamente posicionada em Talatona para servir melhor nossos clientes. Este espaço mantém toda a qualidade e autenticidade do Las Tortillas original, oferecendo um ambiente moderno e acessível para quem trabalha ou vive na região de Talatona.",
      address: "Talatona, Luanda - Angola",
      phone: "+244 949 639 932",
      hours: "Segunda-Quinta: 11:00-23:00 | Sexta-Domingo: 11:00-01:00",
      specialties: ["Menu Executivo", "Pratos Rápidos", "Takeaway", "Delivery"],
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      ],
      features: ["Localização Central", "Takeaway Rápido", "Delivery", "Menu Executivo", "Wi-Fi", "Ambiente Moderno"]
    },
    {
      id: "mobile",
      name: "Las Tortillas Móvel",
      type: "Restaurante Móvel",
      shortDescription: "Levamos a autêntica culinária mexicana até você! Perfeito para eventos e festas.",
      description: "Nossa inovadora experiência móvel que leva toda a qualidade e sabor do Las Tortillas diretamente ao seu evento. Seja para festas corporativas, casamentos, aniversários ou qualquer celebração especial, oferecemos um serviço personalizado com nosso food truck totalmente equipado e nossa equipe especializada.",
      address: "Serviço em toda Luanda e arredores",
      phone: "+244 949 639 932",
      hours: "Disponível sob agendamento",
      specialties: ["Catering de Eventos", "Food Truck", "Festas Corporativas", "Casamentos"],
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      ],
      features: ["Totalmente Equipado", "Equipe Especializada", "Flexibilidade de Horário", "Menu Personalizado", "Setup Completo", "Cobertura em Luanda"]
    }
  ];

  const handleLocationClick = (location: LocationData) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  return (
    <section id="locais" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nossos <span className="text-red-600">Locais</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            3 formas de desfrutar da autêntica culinária mexicana em Luanda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleLocationClick(location)}
            >
              <div className="relative">
                <img
                  src={location.images[0]}
                  alt={location.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {location.type}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{location.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {location.shortDescription}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{location.hours}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {location.specialties.slice(0, 2).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                  {location.specialties.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      +{location.specialties.length - 2} mais
                    </span>
                  )}
                </div>

                <button className="w-full bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition-colors">
                  Ver Detalhes
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        location={selectedLocation}
      />
    </section>
  );
}