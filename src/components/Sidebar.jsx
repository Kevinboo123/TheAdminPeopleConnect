import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiFileText, FiSettings, FiUser, FiHeart } from 'react-icons/fi';
import dashboardlogo from '../assets/DashBoardLogo.png';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-violet-800 text-white p-6 h-screen flex flex-col">
      <div className="flex justify-center mb-8">
        <img src={dashboardlogo} alt="Project Logo" className="w-24 h-24" />
      </div>
      <nav>
        <ul className="space-y-4">
          {[ 
            { path: '/dashboard', icon: FiGrid, text: 'Dashboard' },
            { path: '/categories', icon: FiFileText, text: 'Categories Management' },
            { path: '/services', icon: FiSettings, text: 'Service Management' },
            { path: '/users', icon: FiUser, text: 'User Management' },
            { path: '/posts', icon: FiHeart, text: 'Post Management' },
          ].map(({ path, icon: Icon, text }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  location.pathname === path ? 'bg-violet-800' : 'hover:bg-purple-600'
                }`}
              >
                <Icon size={20} />
                <span>{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
