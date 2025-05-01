import React from 'react';

interface OrderSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const OrderSearch: React.FC<OrderSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        type="text"
        placeholder="Search orders..."
        className="border rounded-lg p-2 w-full text-gray-800 bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
