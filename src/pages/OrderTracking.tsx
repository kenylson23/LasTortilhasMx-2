import { useState } from 'react';
import OrderTrackingComponent from '../components/OrderTracking';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackOrder = () => {
    if (orderId.trim()) {
      setIsTracking(true);
    }
  };

  const handleBack = () => {
    setIsTracking(false);
    setOrderId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20">
        {!isTracking ? (
          <div className="max-w-md mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Rastreamento de Pedido</h1>
                <p className="text-gray-600">Digite o código do seu pedido para acompanhar o status</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Código do pedido (ex: #123)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full border rounded-lg p-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
                
                <button
                  onClick={handleTrackOrder}
                  disabled={!orderId.trim()}
                  className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
                    orderId.trim()
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Rastrear Pedido
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Não tem um código? Entre em contato conosco:
                </p>
                <a
                  href="https://wa.me/244949639932"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  WhatsApp: +244 949 639 932
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="max-w-2xl mx-auto p-6">
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            </div>
            
            <OrderTrackingComponent orderId={orderId.replace('#', '')} />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}