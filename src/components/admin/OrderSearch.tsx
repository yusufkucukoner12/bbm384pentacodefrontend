// components/admin/OrderSearch.tsx
import React from 'react';

interface OrderSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const OrderSearch: React.FC<OrderSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search orders..."
      className="border rounded-lg p-2 w-full mb-4"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};