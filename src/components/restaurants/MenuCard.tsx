import { Menu } from '../../types/Menu';

interface Props {
  menu: Menu;
  onEdit: () => void;
  onDelete: (menuId: number) => void;
  isSelected?: boolean;
  onSelect?: (menuId: number) => void;
}

export function MenuCard({ menu, onEdit, onDelete, isSelected, onSelect }: Props) {
  return (
    <div className="relative p-4 border border-amber-600 rounded-lg shadow-lg bg-orange-50 hover:shadow-xl transition transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(menu.pk)}
                className="h-5 w-5 text-orange-700"
              />
            )}
            <h3 className="text-xl font-bold text-red-700">{menu.name}</h3>
          </div>
          <p className="text-amber-800 mt-1">{menu.description}</p>
          <p className="text-orange-600 font-semibold mt-1">${menu.price.toFixed(2)}</p>
          {menu.category && <p className="text-amber-700 mt-1">Category: {menu.category}</p>}
          <div className="mt-2">
            <span
              className={`inline-block px-2 py-1 rounded text-sm ${
                menu.isAvailable ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}
            >
              {menu.isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <span className="ml-2 inline-block px-2 py-1 rounded text-sm bg-amber-200 text-amber-800">
              {menu.isDrink ? 'Drink' : 'Food'}
            </span>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-orange-700 text-white rounded hover:bg-orange-800 mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(menu.pk)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      <img
        src={menu.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
        alt={menu.name}
        className="mt-4 w-full h-40 object-cover rounded"
      />
    </div>
  );
}