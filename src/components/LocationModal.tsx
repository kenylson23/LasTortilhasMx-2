import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData | null;
}

export default function LocationModal({ isOpen, onClose, location }: LocationModalProps) {
  if (!location) return null;

  const handleReservation = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de fazer uma reserva no ${location.name}. ${location.type === 'mobile' ? 'Gostaria de saber a disponibilidade para um evento.' : ''}`
    );
    window.location.href = `https://wa.me/244949639932?text=${message}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <img
                src={location.images[0]}
                alt={location.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-3xl font-bold mb-2">{location.name}</h2>
                <p className="text-lg opacity-90">{location.type}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sobre este Local</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{location.description}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Info */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Informações de Contato</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{location.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{location.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{location.hours}</span>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Especialidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {location.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Características</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {location.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {location.images.length > 1 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Galeria</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {location.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${location.name} - ${index + 2}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleReservation}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  {location.type === 'mobile' ? 'Solicitar para Evento' : 'Fazer Reserva'}
                </button>
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Olá! Gostaria de mais informações sobre o ${location.name}.`);
                    window.location.href = `https://wa.me/244949639932?text=${message}`;
                  }}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-700 transition-colors"
                >
                  Mais Informações
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}