import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Users, MapPin, AlertCircle, CheckCircle, Clock, Wrench, X } from 'lucide-react';
import { Table, InsertTable } from '@shared/schema';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onSave: (table: Partial<Table>) => void;
  allTables: Table[];
}

function TableModal({ isOpen, onClose, table, onSave, allTables }: TableModalProps) {
  const [formData, setFormData] = useState<Partial<InsertTable>>({
    number: table?.number || 1,
    locationId: table?.locationId || 'talatona',
    capacity: table?.capacity || 2,
    status: table?.status || 'available',
    position: table?.position || '',
    features: table?.features || [],
    notes: table?.notes || ''
  });

  const locations = [
    { id: 'talatona', name: 'Talatona' },
    { id: 'ilha', name: 'Ilha de Luanda' },
    { id: 'movel', name: 'Unidade Móvel' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Disponível', color: 'bg-green-100 text-green-800' },
    { value: 'occupied', label: 'Ocupada', color: 'bg-red-100 text-red-800' },
    { value: 'reserved', label: 'Reservada', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'maintenance', label: 'Manutenção', color: 'bg-gray-100 text-gray-800' }
  ];

  const features = [
    'ar_condicionado',
    'vista_mar',
    'kids_area',
    'acessibilidade',
    'varanda',
    'vip'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = formData.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    setFormData({ ...formData, features: newFeatures });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {table ? 'Editar Mesa' : 'Nova Mesa'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número da Mesa</label>
              {(() => {
                const existingNumbers = allTables
                  .filter(t => t.locationId === formData.locationId && t.id !== table?.id)
                  .map(t => t.number);
                
                const isDuplicate = existingNumbers.includes(formData.number || 0);
                
                return (
                  <>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                        className={`w-full p-2 border rounded-md ${isDuplicate 
                          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                        required
                        min="1"
                      />
                      {isDuplicate && (
                        <div className="absolute right-2 top-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    
                    {isDuplicate && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-700">
                            <strong>Mesa {formData.number} já existe</strong> no local {locations.find(l => l.id === formData.locationId)?.name}
                          </p>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          Por favor, escolha um número diferente.
                        </p>
                      </div>
                    )}
                    
                    {existingNumbers.length > 0 && !isDuplicate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Mesas existentes: {existingNumbers.sort((a, b) => a - b).join(', ')}
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Capacidade</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-md"
                required
                min="1"
                max="12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Local</label>
            <select
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Posição</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Ex: Janela, Centro, Varanda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Características</label>
            <div className="grid grid-cols-2 gap-2">
              {features.map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.features?.includes(feature) || false}
                    onChange={() => toggleFeature(feature)}
                    className="rounded"
                  />
                  <span className="text-sm">{feature.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Observações especiais sobre a mesa..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            {(() => {
              const existingNumbers = allTables
                .filter(t => t.locationId === formData.locationId && t.id !== table?.id)
                .map(t => t.number);
              
              const isDuplicate = existingNumbers.includes(formData.number || 0);
              
              return (
                <button
                  type="submit"
                  disabled={isDuplicate}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isDuplicate 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {table ? 'Atualizar' : 'Criar'}
                </button>
              );
            })()}
          </div>
        </form>
      </div>
    </div>
  );
}

// Toast Component para notificações elegantes
function Toast({ message, type, onClose }: { message: string; type: 'error' | 'success' | 'info'; onClose: () => void }) {
  const bgColor = type === 'error' ? 'bg-red-50 border-red-200' : 
                  type === 'success' ? 'bg-green-50 border-green-200' : 
                  'bg-blue-50 border-blue-200';
  
  const textColor = type === 'error' ? 'text-red-800' : 
                    type === 'success' ? 'text-green-800' : 
                    'text-blue-800';
  
  const iconColor = type === 'error' ? 'text-red-500' : 
                    type === 'success' ? 'text-green-500' : 
                    'text-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md ${bgColor} border rounded-lg shadow-lg p-4 animate-in slide-in-from-top-2`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {type === 'error' && <AlertCircle className="w-5 h-5" />}
          {type === 'success' && <CheckCircle className="w-5 h-5" />}
          {type === 'info' && <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-semibold ${textColor} mb-1`}>
            {type === 'error' ? 'Erro ao criar mesa' : 
             type === 'success' ? 'Sucesso' : 
             'Informação'}
          </h3>
          <p className={`text-sm ${textColor.replace('800', '700')}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function TableManagement() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const queryClient = useQueryClient();

  // Função centralizada para invalidar cache de mesas
  const invalidateTableCache = () => {
    console.log('🔄 Invalidating table cache...');
    // Invalidar todas as queries relacionadas a mesas
    queryClient.invalidateQueries({ predicate: (query) => 
      query.queryKey[0] === '/api/tables' 
    });
    // Remover cache para forçar refetch
    queryClient.removeQueries({ predicate: (query) => 
      query.queryKey[0] === '/api/tables' 
    });
    // Refetch imediato
    queryClient.refetchQueries({ predicate: (query) => 
      query.queryKey[0] === '/api/tables' 
    });
  };

  const { data: tables, isLoading, error } = useQuery({
    queryKey: ['/api/tables'],
    queryFn: async () => {
      const response = await fetch('/api/tables');
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      return response.json();
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    refetchIntervalInBackground: true, // Keep refreshing even when tab is not active
  });

  // Debug log
  console.log('Tables data:', tables);
  console.log('Tables loading:', isLoading);
  console.log('Tables error:', error);

  const createTableMutation = useMutation({
    mutationFn: async (table: InsertTable) => {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(table)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar mesa');
      }
      return response.json();
    },
    onSuccess: () => {
      console.log('✅ Table created successfully');
      invalidateTableCache();
      setModalOpen(false);
      setSelectedTable(null);
      setToast({ message: 'Mesa criada com sucesso!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    },
    onError: (error: Error) => {
      console.error('❌ Error creating table:', error.message);
      setToast({ 
        message: error.message.includes('Já existe') 
          ? `${error.message}. Por favor, escolha um número diferente.`
          : error.message, 
        type: 'error' 
      });
      // Auto-hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
    }
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, table }: { id: number; table: Partial<Table> }) => {
      const response = await fetch(`/api/tables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(table)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar mesa');
      }
      return response.json();
    },
    onSuccess: () => {
      console.log('✅ Table updated successfully');
      invalidateTableCache();
      setModalOpen(false);
      setSelectedTable(null);
      setToast({ message: 'Mesa atualizada com sucesso!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    },
    onError: (error: Error) => {
      console.error('❌ Error updating table:', error.message);
      setToast({ 
        message: error.message.includes('Já existe') 
          ? `${error.message}. Por favor, escolha um número diferente.`
          : error.message, 
        type: 'error' 
      });
      // Auto-hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/tables/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete table');
      }
      return response.json();
    },
    onSuccess: () => {
      console.log('✅ Table deleted successfully');
      invalidateTableCache();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/tables/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error('Failed to update table status');
      }
      return response.json();
    },
    onSuccess: () => {
      console.log('✅ Table status updated successfully');
      invalidateTableCache();
    }
  });

  const handleSaveTable = (tableData: Partial<Table>) => {
    if (selectedTable) {
      updateTableMutation.mutate({ id: selectedTable.id, table: tableData });
    } else {
      createTableMutation.mutate(tableData as InsertTable);
    }
    setSelectedTable(null);
  };

  const handleEditTable = (table: Table) => {
    setSelectedTable(table);
    setModalOpen(true);
  };

  const handleDeleteTable = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta mesa?')) {
      deleteTableMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'occupied':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'reserved':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      case 'maintenance':
        return 'Manutenção';
      default:
        return status;
    }
  };

  const filteredTables = tables?.filter((table: Table) => 
    selectedLocation === 'all' || table.locationId === selectedLocation
  ) || [];

  const locations = [
    { id: 'all', name: 'Todos os Locais' },
    { id: 'talatona', name: 'Talatona' },
    { id: 'ilha', name: 'Ilha de Luanda' },
    { id: 'movel', name: 'Unidade Móvel' }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Mesas</h2>
        <button
          onClick={() => {
            setSelectedTable(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Mesa</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table: Table) => (
          <div key={table.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Mesa {table.number}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{locations.find(l => l.id === table.locationId)?.name}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTable(table)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{table.capacity} pessoas</span>
              </div>

              {table.position && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{table.position}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {getStatusIcon(table.status)}
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(table.status)}`}>
                  {getStatusText(table.status)}
                </span>
              </div>

              {table.features && table.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {table.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {feature.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="available">Disponível</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
                <option value="maintenance">Manutenção</option>
              </select>
            </div>

            {table.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <p className="text-gray-700">{table.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-6xl mb-4">🪑</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Nenhuma mesa encontrada
          </h3>
          <p className="text-gray-600">
            Comece criando sua primeira mesa para este local.
          </p>
        </div>
      )}

      <TableModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        table={selectedTable}
        onSave={handleSaveTable}
        allTables={tables || []}
      />

      {/* Toast de notificação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}