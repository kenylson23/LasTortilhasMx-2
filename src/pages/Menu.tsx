import { useState } from 'react';
import { useLocation } from 'wouter';
import OnlineMenu from '../components/OnlineMenu';
import { Order } from '@shared/schema';

export default function Menu() {
  const [, setLocation] = useLocation();
  const [selectedLocationId, setSelectedLocationId] = useState<string>('ilha');

  const handleOrderCreated = (order: Order) => {
    // Modal melhorado já é exibido automaticamente no OnlineMenu
    // Não precisamos de mensagem adicional aqui
    console.log('Pedido criado com sucesso:', order);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Menu Component - Header será unificado dentro do componente */}
      <OnlineMenu
        locationId={selectedLocationId}
        onOrderCreated={handleOrderCreated}
        onLocationChange={setSelectedLocationId}
        onBackToSite={() => setLocation('/')}
      />
    </div>
  );
}