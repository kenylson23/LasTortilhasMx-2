import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { MenuItem, InsertMenuItem } from '../../shared/schema';
import { apiRequest } from '../lib/queryClient';
import ImageUpload from './ImageUpload';

export default function MenuManagement() {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InsertMenuItem>>({
    name: '',
    description: '',
    price: '0',
    category: '',
    image: '',
    available: true
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch menu items with auto-refresh
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    refetchIntervalInBackground: true, // Keep refreshing even when tab is not active
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: InsertMenuItem) => {
      const response = await apiRequest('POST', '/api/menu-items', item);
      return response.json();
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas ao menu
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      // Força refetch imediato para atualização instantânea
      queryClient.refetchQueries({ queryKey: ['/api/menu-items'] });
      toast({
        title: 'Item adicionado',
        description: 'O item foi adicionado ao menu com sucesso',
        variant: 'success'
      });
      setIsAddingItem(false);
      setNewItem({
        name: '',
        description: '',
        price: '0',
        category: '',
        image: '',
        available: true
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar item',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<MenuItem> }) => {
      const response = await apiRequest('PUT', `/api/menu-items/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      // Invalidar e forçar refetch para atualização instantânea
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      queryClient.refetchQueries({ queryKey: ['/api/menu-items'] });
      toast({
        title: 'Item atualizado',
        description: 'O item foi atualizado com sucesso',
        variant: 'success'
      });
      setEditingItem(null);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar item',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.category && newItem.price) {
      addItemMutation.mutate(newItem as InsertMenuItem);
    }
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, updates: editingItem });
    }
  };

  const toggleAvailability = (item: MenuItem) => {
    updateItemMutation.mutate({
      id: item.id,
      updates: { available: !item.available }
    });
  };

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/menu-items/${id}`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidar e forçar refetch para atualização instantânea
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      queryClient.refetchQueries({ queryKey: ['/api/menu-items'] });
      toast({
        title: 'Item removido',
        description: 'O item foi removido com sucesso',
        variant: 'success'
      });
      setItemToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover item',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleDeleteItem = (item: MenuItem) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItemMutation.mutate(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestão de Menu</h2>
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          Adicionar Item
        </button>
      </div>

      {/* Add Item Form */}
      {isAddingItem && (
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border">
          <h3 className="text-lg font-semibold mb-4">Adicionar Novo Item</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (AOA)</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
                <ImageUpload
                  onImageUploaded={(imageUrl) => setNewItem({...newItem, image: imageUrl})}
                  currentImage={newItem.image}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newItem.available}
                onChange={(e) => setNewItem({...newItem, available: e.target.checked})}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label className="text-sm text-gray-700">Disponível</label>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={addItemMutation.isPending}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
              >
                {addItemMutation.isPending ? 'Adicionando...' : 'Adicionar Item'}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items by Category */}
      {categories.map(category => (
        <div key={category} className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">{category}</h3>
          <div className="space-y-4">
            {menuItems
              .filter(item => item.category === category)
              .map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1 sm:flex-initial">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      <p className="text-sm sm:text-lg font-semibold text-red-600">{Number(item.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        item.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.available ? 'Disponível' : 'Indisponível'}
                    </button>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      disabled={deleteItemMutation.isPending}
                      className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm disabled:opacity-50"
                    >
                      {deleteItemMutation.isPending ? 'Removendo...' : 'Apagar'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Editar Item</h3>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço (AOA)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
                  <ImageUpload
                    onImageUploaded={(imageUrl) => setEditingItem({...editingItem, image: imageUrl})}
                    currentImage={editingItem.image || ''}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingItem.available}
                  onChange={(e) => setEditingItem({...editingItem, available: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">Disponível</label>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={updateItemMutation.isPending}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {updateItemMutation.isPending ? 'Atualizando...' : 'Atualizar Item'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Tem certeza que deseja remover <strong>"{itemToDelete.name}"</strong>?
              <br />
              <span className="text-sm text-red-600 mt-2 block">
                Esta ação não pode ser desfeita.
              </span>
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteItemMutation.isPending}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {deleteItemMutation.isPending ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}