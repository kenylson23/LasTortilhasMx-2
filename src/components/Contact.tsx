import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

interface ReservationData {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export default function Contact() {
  const toast = (options: { title: string; description: string; variant?: string }) => {
    alert(`${options.title}: ${options.description}`);
  };
  
  const [formData, setFormData] = useState<ReservationData>({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: 2,
    notes: ""
  });

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  // Função debounced para verificar disponibilidade
  const checkAvailability = useCallback(async (date: string, time: string) => {
    if (!date || !time) {
      setAvailabilityStatus(null);
      return;
    }

    setIsCheckingAvailability(true);
    
    try {
      const response = await fetch(`/api/availability?date=${date}&time=${time}`);
      const data = await response.json();
      
      if (data.available) {
        setAvailabilityStatus({
          available: true,
          message: "✓ Horário disponível!"
        });
      } else {
        setAvailabilityStatus({
          available: false,
          message: "✗ Horário já reservado. Escolha outro horário."
        });
      }
    } catch (error) {
      setAvailabilityStatus({
        available: false,
        message: "Erro ao verificar disponibilidade"
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  }, []);

  // Verificar disponibilidade quando data e horário mudarem
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability(formData.date, formData.time);
    }, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.date, formData.time, checkAvailability]);

  const handleWhatsAppRedirect = () => {
    const whatsappMessage = `Olá Las Tortillas Mexican Grill! Gostaria de fazer uma reserva:

*Nome:* ${formData.name}
*Telefone:* ${formData.phone}
${formData.email ? `*Email:* ${formData.email}` : ''}
*Data:* ${formData.date}
*Hora:* ${formData.time}
*Número de pessoas:* ${formData.guests}
${formData.notes ? `*Observações:* ${formData.notes}` : ''}

Obrigado!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/244949639932?text=${encodedMessage}`;
    
    // Redirecionar imediatamente
    window.location.href = whatsappUrl;
    
    // Resetar formulário após redirecionamento
    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        guests: 2,
        notes: ""
      });
      setAvailabilityStatus(null);
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Telefone obrigatório",
        description: "Por favor, informe seu telefone.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione uma data.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.time) {
      toast({
        title: "Horário obrigatório",
        description: "Por favor, selecione um horário.",
        variant: "destructive",
      });
      return;
    }

    // Redirecionar imediatamente para o WhatsApp
    handleWhatsAppRedirect();
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Telefone",
      description: "+244 949 639 932",
      bgColor: "bg-red-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Localização",
      description: "Ilha de Luanda, Angola",
      bgColor: "bg-green-700"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Horário",
      description: "Seg-Qui: 11:00-23:00 | Sex-Dom: 11:00-01:00",
      bgColor: "bg-orange-500"
    }
  ];

  return (
    <section id="contato" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Faça Sua Reserva
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Entre em contato conosco e garante a sua mesa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="p-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Informações de Contato</h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div 
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${info.bgColor} rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white flex-shrink-0`}>
                        {info.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{info.title}</div>
                        <div className="text-gray-600 text-sm sm:text-base">{info.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <p className="text-gray-600 mb-4">
                    Siga-nos nas redes sociais para novidades e promoções!
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white hover:bg-green-800 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Formulário de Reserva</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="+244 XXX XXX XXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Selecione o horário</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                    <option value="00:00">00:00</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Pessoas *
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value={1}>1 pessoa</option>
                    <option value={2}>2 pessoas</option>
                    <option value={3}>3 pessoas</option>
                    <option value={4}>4 pessoas</option>
                    <option value={5}>5 pessoas</option>
                    <option value={6}>6+ pessoas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={4}
                    placeholder="Alguma observação especial..."
                  />
                </div>

                {/* Status de Disponibilidade */}
                {(formData.date && formData.time) && (
                  <div className="p-4 rounded-lg border">
                    {isCheckingAvailability ? (
                      <div className="flex items-center text-gray-600">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verificando disponibilidade...
                      </div>
                    ) : availabilityStatus && (
                      <div className={`font-medium ${availabilityStatus.available ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'} p-3 rounded-lg`}>
                        {availabilityStatus.message}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!availabilityStatus?.available || isCheckingAvailability}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
                    (!availabilityStatus?.available || isCheckingAvailability) 
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="hidden sm:inline">Reservar via WhatsApp</span>
                  <span className="sm:hidden">Reservar</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}