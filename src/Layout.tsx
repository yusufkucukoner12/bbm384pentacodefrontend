// Layout.tsx
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

// Define types for sidebar items
interface Subpage {
  text: string;
  to: string;
}

interface SidebarItem {
  text: string;
  to: string;
  subpages?: Subpage[];
}

const Layout: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    { text: 'Account', to: '/account' },
    {
      text: 'Restaurant Menu',
      to: '/menu',
      subpages: [
        { text: 'Burgers', to: '/menu/burgers' },
        { text: 'Salads', to: '/menu/salads' },
      ],
    },
    { text: 'Orders', to: '/orders' },
    { text: 'Assigned Couriers', to: '/couriers' },
    { text: 'Idle Couriers', to: '/idle-couriers' },
  ];

  // Mock isActive function (you should implement this based on your routing)
  const isActive = (path: string): boolean => {
    return window.location.pathname === path; // Simplified; use useLocation() in a real app
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 p-4 flex justify-between items-center">
        <button className="bg-orange-800 text-white px-4 py-2 rounded hover:bg-orange-700">
          Log out
        </button>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/5 bg-orange-800 text-white flex flex-col p-4">
          {sidebarItems.map((item) => (
            <div
              key={item.to}
              className="relative mb-2"
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={item.to}
                className={`block py-2 px-4 bg-orange-600 rounded text-left no-underline ${
                  isActive(item.to)
                    ? 'text-blue-600 font-bold hover:bg-orange-700'
                    : 'text-white font-normal hover:bg-orange-700'
                }`}
              >
                {item.text}
              </Link>

              {/* Submenu */}
              {item.subpages && (
                <div
                  className={`absolute top-0 left-full min-w-[160px] border border-gray-300 bg-white py-2 shadow-md z-10 ${
                    hoveredItem === item.to ? 'block' : 'hidden'
                  }`}
                >
                  {item.subpages.map((sub) => (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      className="block px-4 py-2 text-black no-underline hover:bg-gray-100"
                    >
                      {sub.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;