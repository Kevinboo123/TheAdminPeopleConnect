import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiFileText, FiSettings, FiUser, FiHeart, FiLogOut, FiChevronRight } from 'react-icons/fi';
import dashboardlogo from '../assets/DashBoardLogo.png';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <div 
        className={`${
          isExpanded ? 'w-64' : 'w-20'
        } bg-violet-800 text-white h-screen flex flex-col fixed transition-all duration-500 ease-in-out`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={`flex justify-center py-6 ${isExpanded ? 'px-6' : 'px-2'}`}>
          <img 
            src={dashboardlogo} 
            alt="Project Logo" 
            className={`transition-all duration-300 ${
              isExpanded ? 'w-24 h-24' : 'w-12 h-12'
            }`}
          />
        </div>
        
        <nav className="flex-grow">
          <ul className="space-y-2">
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
                  className={`flex items-center ${
                    isExpanded ? 'px-6' : 'px-4'
                  } py-3 transition-colors duration-200 ${
                    location.pathname === path 
                      ? 'bg-purple-600 text-white' 
                      : 'text-white hover:bg-purple-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className={`ml-3 transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    {text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex items-center ${
            isExpanded ? 'px-6' : 'px-4'
          } py-3 hover:bg-purple-700 transition-colors duration-200 mb-6`}
        >
          <FiLogOut size={20} />
          <span className={`ml-3 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 w-0'
          }`}>
            Logout
          </span>
        </button>

        {/* Expand/Collapse Indicator */}
        <div className={`absolute -right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ${
          isExpanded ? 'rotate-180' : ''
        }`}>
          <div className="bg-purple-600 rounded-full p-1">
            <FiChevronRight className="text-white" size={16} />
          </div>
        </div>
      </div>

      {/* Content Margin */}
      <div className={`${isExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Your main content goes here */}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Are you sure you want to logout?</h2>
            <div className="flex space-x-4 justify-center">
              <button 
                onClick={handleLogout}
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
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
