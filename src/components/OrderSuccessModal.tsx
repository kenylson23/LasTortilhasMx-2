import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Phone, CopyIcon, Share } from 'lucide-react';
import { Order } from '@shared/schema';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  locationId: string;
  onTrackOrder?: (orderId: string) => void;
}

export default function OrderSuccessModal({ isOpen, onClose, order, locationId, onTrackOrder }: OrderSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const getLocationName = (locationId: string) => {
    switch (locationId) {
      case 'ilha': return 'Las Tortillas Ilha';
      case 'talatona': return 'Las Tortillas Talatona';
      case 'movel': return 'Las Tortillas Móvel';
      default: return locationId;
    }
  };

  const getEstimatedTime = () => {
    if (order.orderType === 'delivery') return '45-60 minutos';
    if (order.orderType === 'takeaway') return '15-20 minutos';
    return '20-25 minutos';
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOrder = () => {
    const message = `🌮 Pedido Las Tortillas #${order.id}\n\n✅ Confirmado!\n💰 Total: ${order.totalAmount} AOA\n⏱️ Tempo estimado: ${getEstimatedTime()}\n📍 ${getLocationName(locationId)}\n\nAcompanhe seu pedido: ${window.location.origin}/rastreamento`;
    
    if (navigator.share) {
      navigator.share({
        title: `Pedido Las Tortillas #${order.id}`,
        text: message
      });
    } else {
      // Fallback para WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com gradiente mexicano */}
            <div className="bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 p-6 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-lg"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                ¡Pedido Confirmado!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-lg"
              >
                🌮 Seu pedido foi recebido com sucesso
              </motion.p>
            </div>

            {/* Conteúdo principal */}
            <div className="p-6">

              {/* Card principal com informações do pedido */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200"
              >
                {/* Número do pedido destacado */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                    <span className="text-sm text-gray-600">Pedido</span>
                    <span className="font-bold text-2xl text-red-600">#{order.id}</span>
                    <button
                      onClick={copyOrderId}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copiar número do pedido"
                    >
                      <CopyIcon className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-gray-500'}`} />
                    </button>
                  </div>
                </div>

                {/* Grid de informações */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                      <span className="text-2xl font-bold text-green-600">{order.totalAmount}</span>
                    </div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-bold text-green-600">AOA</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600">Tempo Estimado</p>
                    <p className="font-bold text-orange-600">{getEstimatedTime()}</p>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Local
                    </span>
                    <span className="font-semibold">{getLocationName(locationId)}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Tipo de Pedido</span>
                    <span className="font-semibold capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                      {order.orderType === 'delivery' ? '🚚 Entrega' : 
                       order.orderType === 'takeaway' ? '🥡 Retirada' : '🍽️ Mesa'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Botões de ação modernos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                {/* Botão principal de rastreamento */}
                <button
                  onClick={() => {
                    if (onTrackOrder) {
                      onTrackOrder(order.id.toString());
                      onClose();
                    } else {
                      window.location.href = '/menu#tracking';
                    }
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Clock className="w-6 h-6" />
                  🌮 Acompanhar Meu Pedido
                </button>

                {/* Botões secundários */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareOrder}
                    className="bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Share className="w-4 h-4" />
                    Compartilhar
                  </button>

                  <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    Fechar
                  </button>
                </div>

                {/* Mensagem motivacional */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl text-center"
                >
                  <p className="text-sm text-blue-800 font-medium">
                    🎉 Obrigado por escolher Las Tortillas!
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Estamos preparando seu pedido com muito carinho
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}