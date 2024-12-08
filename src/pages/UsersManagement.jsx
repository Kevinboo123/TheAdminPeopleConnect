import React, { useEffect, useState } from 'react';
import { MoreVertical, Trash2 } from 'react-feather';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Default avatar as a data URI
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";

const UsersManagement = () => {
  const [clients, setClients] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [userType, setUserType] = useState('client');
  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const clientsArray = [];
      const providersArray = [];

      if (data) {
        Object.entries(data).forEach(([id, userData]) => {
          const userWithStatus = {
            ...userData,
            id,
            status: userData.status || 'enabled'
          };

          if (userData.roles) {
            if (userData.roles.includes('Client')) {
              clientsArray.push({ ...userWithStatus, userType: 'client' });
            }
            if (userData.roles.includes('Service Provider')) {
              providersArray.push({ ...userWithStatus, userType: 'service provider' });
            }
          }
        });
        setClients(clientsArray);
        setServiceProviders(providersArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const displayUsers = userType === 'client' ? clients : serviceProviders;

  const handleToggleUserStatus = async () => {
    if (!selectedUser) return;

    try {
      console.log('Disabling user with email:', selectedUser.email);
      const userRef = ref(database, `users/${selectedUser.id}`);
      
      await update(userRef, { status: 'disabled' });

      setShowModal(false);
      setShowMenu(null);
      toast.success(`${selectedUser.name} has been disabled successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(`Failed to change user status: ${error.message}`);
    }
  };

  const handleEnableUserStatus = async () => {
    if (!selectedUser) return;

    try {
      console.log('Enabling user with email:', selectedUser.email);
      const userRef = ref(database, `users/${selectedUser.id}`);
      
      await update(userRef, { status: 'enabled' });

      setShowModal(false);
      setShowMenu(null);
      toast.success(`${selectedUser.name} has been enabled successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(`Failed to change user status: ${error.message}`);
    }
  };

  return (
    <div className="users-management p-6">
      <h2 className="users-management__title text-2xl text-purple-600 font-bold mb-4">User Information</h2>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setUserType('client')} className={`px-6 py-2 rounded-lg font-medium ${userType === 'client' ? 'bg-violet-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Client ({clients.length})
        </button>
        <button onClick={() => setUserType('service provider')} className={`px-6 py-2 rounded-lg font-medium ${userType === 'service provider' ? 'bg-violet-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Service Provider ({serviceProviders.length})
        </button>
      </div>

      <ul className="users-list bg-white rounded-lg shadow">
        {displayUsers.length > 0 ? (
          displayUsers.map((user) => (
            <li key={user.id} className="users-list__item flex items-center justify-between p-4 border-b last:border-b-0 relative">
              <div className="flex items-center">
                <div className="users-list__avatar w-10 h-10 rounded-full overflow-hidden mr-3">
                  <div className="bg-violet-600 w-full h-full flex items-center justify-center">
                    <img 
                      src={user.profileImageUrl || DEFAULT_AVATAR} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="users-list__name font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                  {user.userType === 'service provider' && (
                    <span className="text-xs text-violet-600">Rating: {user.rating || 'No ratings yet'}</span>
                  )}
                  <span className={`text-xs ${
                    user.status === 'disabled' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    Status: {user.status === 'disabled' ? 'Disabled' : 'Active'}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMenu(showMenu === user.id ? null : user.id)}>
                  <MoreVertical size={20} />
                </button>
                {showMenu === user.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <button 
                      onClick={() => { setSelectedUser(user); setShowModal(true); }} 
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        user.status === 'disabled' 
                          ? 'text-purple-600 hover:bg-purple-50' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 size={16} className="mr-2" />
                      {user.status === 'disabled' ? 'Enable User' : 'Disable User'}
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No {userType}s found</li>
        )}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md text-center w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {selectedUser?.status === 'disabled' 
                ? `Are you sure you want to enable ${selectedUser?.name}?` 
                : `Are you sure you want to disable ${selectedUser?.name}?`}
            </h2>
            <div className="flex space-x-2 justify-center">
              {selectedUser?.status === 'disabled' ? (
                <button onClick={handleEnableUserStatus} className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">Enable</button>
              ) : (
                <button onClick={handleToggleUserStatus} className="bg-red-500 hovergit:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">Disable</button>
              )}
              <button onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default UsersManagement;
