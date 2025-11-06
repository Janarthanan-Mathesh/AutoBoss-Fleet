import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/autos', label: 'Autos', icon: '🚗' },
    { path: '/drivers', label: 'Drivers', icon: '👤' },
    { path: '/rentals', label: 'Rentals', icon: '📋' },
    { path: '/payments', label: 'Payments', icon: '💰' },
    { path: '/maintenance', label: 'Maintenance', icon: '🔧' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">AutoBoss</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 ${
                  location.pathname === item.path ? 'bg-gray-700' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-4 left-4">
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
