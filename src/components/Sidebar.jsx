import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiFileText, FiSettings, FiUser, FiHeart, FiLogOut } from 'react-icons/fi';
import dashboardlogo from '../assets/DashBoardLogo.png';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <div className="w-64 bg-violet-800 text-white p-6 h-screen flex flex-col">
        <div className="flex justify-center mb-8">
          <img src={dashboardlogo} alt="Project Logo" className="w-24 h-24" />
        </div>
        <nav className="flex-grow">
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
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === path 
                      ? 'bg-purple-600 text-white' 
                      : 'text-white hover:bg-purple-700'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={location.pathname === path ? 'text-white' : ''}
                  />
                  <span>{text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 mt-auto w-full"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Are you sure you want to logout?</h2>
            <div className="flex space-x-4 justify-center">
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Logout
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
