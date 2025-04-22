// components/restaurants/MenuCard.tsx
import { useState } from 'react';
import { Menu } from '../../types/Menu';

interface Props {
  menu: Menu;
  onEdit: () => void;
  onDelete: (menuId: number) => void; // 🔧 Bunu ekle
}

export function MenuCard({ menu, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(menu.name);
  const [description, setDescription] = useState(menu.description);
  const [price, setPrice] = useState(menu.price.toString());

  const handleSave = () => {
    onEdit();
    setExpanded(false);
  };

  const handleCancel = () => {
    setName(menu.name);
    setDescription(menu.description);
    setPrice(menu.price.toString());
    setExpanded(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kart tıklanmasını engelle
    onDelete(menu.pk);   // Menü ID'sini gönder
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
          <textarea
            className="w-full border rounded px-2 py-1 mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full border rounded px-2 py-1 mb-2"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded mr-2"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded mr-2"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-orange-600 text-white rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">{menu.name}</h3>
          <p>{menu.description}</p>
          <p className="text-orange-600 font-bold">${menu.price}</p>
        </div>
      )}
    </div>
  );
}
