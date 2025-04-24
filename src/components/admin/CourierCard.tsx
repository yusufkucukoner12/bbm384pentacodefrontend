// components/admin/CourierCard.tsx
import { useState } from 'react';
import { CourierDTO } from '../../types/Courier';

interface Props {
  courier: CourierDTO;
  onEdit: () => void;
  onDelete: (courierId: number) => void;
}

export function CourierCard({ courier, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(courier.name);
  const [phone, setPhone] = useState(courier.phoneNumber);

  const handleSave = () => {
    onEdit();
    setExpanded(false);
  };

  const handleCancel = () => {
    setName(courier.name);
    setPhone(courier.phoneNumber);
    setExpanded(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(courier.pk);
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
          <input
            className="w-full border rounded px-2 py-1 mb-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          <h3 className="text-lg font-semibold">{courier.name}</h3>
          <p>Telefon: {courier.phoneNumber}</p>
        </div>
      )}
    </div>
  );
}
