import { Menu } from '../types/Menu'; // Adjust the import path

interface AddToCartButtonProps {
  menuItem: Menu;
  onClick: (item: Menu) => void;
}

export function AddToCartButton({ menuItem, onClick }: AddToCartButtonProps) {
  return (
    <button
      onClick={() => onClick(menuItem)}
      className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
    >
      Add to Cart
    </button>
  );
}
// 