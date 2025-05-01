// components/FilterPanel.tsx
export function FilterPanel() {
  return (
    <div className="w-64 p-4 border rounded-lg bg-white shadow-md h-fit">
      <h3 className="text-lg font-semibold mb-3">Meals</h3>
      <input
        type="text"
        placeholder="Search meals"
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {['Burger', 'Pizza', 'Rib', 'Lahmacun', 'Kebab', 'Soup'].map(tag => (
          <span key={tag} className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 cursor-pointer">
            {tag} ❌
          </span>
        ))}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-sm">Fast Delivery</label>
        <input type="checkbox" checked readOnly className="mr-2 rounded-md border-gray-300" />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-sm">Payment Methods</label>
        {['Credit Card', 'Bank Card', 'Pluxee', 'Multinet', 'Cash on Delivery'].map(method => (
          <div key={method} className="flex items-center mb-1">
            <input type="checkbox" checked readOnly className="mr-2 rounded-md border-gray-300" />
            <span>{method}</span>
          </div>
        ))}
      </div>

      <div>
        <label className="block font-medium mb-2 text-sm">Price</label>
        <input type="range" min={0} max={500} className="w-full" />
        <p className="text-sm text-gray-500">TL0-500</p>
      </div>
    </div>
  );
}
