// components/SearchAndSort.tsx
export function SearchAndSort() {
    return (
      <div className="flex justify-between items-center p-4">
        <input
          type="text"
          placeholder="Search"
          className="border px-4 py-2 rounded w-1/3"
        />
        <div className="flex gap-2">
          <button className="bg-orange-600 text-white px-3 py-1 rounded">Restaurant Rate</button>
          <button className="bg-gray-200 px-3 py-1 rounded">Default</button>
          <button className="bg-gray-200 px-3 py-1 rounded">Minimum Price</button>
          <button className="bg-gray-200 px-3 py-1 rounded">Distance</button>
        </div>
      </div>
    );
  }
  