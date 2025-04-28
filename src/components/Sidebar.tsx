import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  routes: { to: string; text: string; subpages?: { to: string; text: string }[] }[];
}

const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
  return (
    <div className="w-1/5 bg-orange-800 text-white flex flex-col p-4">
      {routes.map((item) => (
        <div key={item.to} className="relative mb-2">
          <Link
            to={item.to}
            className="block py-2 px-4 bg-orange-600 rounded text-left no-underline text-white font-normal hover:bg-orange-700"
          >
            {item.text}
          </Link>
          {item.subpages && (
            <div className="absolute top-0 left-full min-w-[160px] border border-gray-300 bg-white py-2 shadow-md z-10">
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
    </div>
  );
};

export default Sidebar;
