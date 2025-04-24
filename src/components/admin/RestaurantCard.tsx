// components/admin/RestaurantCard.tsx
import { useState } from 'react';
import { Restaurant } from '../../types/Restaurant';

interface Props {
  restaurant: Restaurant;
  onEdit: () => void;
  onDelete: (restaurantId: number) => void;
}

export function RestaurantCard({ restaurant, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(restaurant.name);

  const handleSave = () => {
    onEdit();
    setExpanded(false);
  };

  const handleCancel = () => {
    setName(restaurant.name);
    setExpanded(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(restaurant.pk);
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow transition-all duration-300 bg-white ${
        expanded ? 'scale-105' : ''
      }`}
      onClick={() => setExpanded(true)}
    >
      {expanded ? (
        <div>
          <input
            className="w-full border rounded px-2 py-1 mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <div className="flex justify-end">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded mr-2"
              onClick={handleDelete}
            >
              Sil
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded mr-2"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            >
              İptal
            </button>
            <button
              className="px-3 py-1 bg-orange-600 text-white rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              Kaydet
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">{restaurant.name}</h3>
        </div>
      )}
    </div>
  );
}
