import React, { useEffect, useState } from 'react';
import { MoreVertical, Trash2 } from 'react-feather';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersManagement = () => {
  const [clients, setClients] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [userType, setUserType] = useState('client');
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    // Fetch clients from 'users' node
    const clientsRef = ref(database, 'users');
    onValue(clientsRef, (snapshot) => {
      const data = snapshot.val();
      const clientsArray = [];

      if (data) {
        Object.entries(data).forEach(([id, userData]) => {
          if (!userData.userType || userData.userType === 'client') {
            clientsArray.push({
              id,
              name: userData.name || 'No Name',
              email: userData.email || 'No Email',
              phoneNumber: userData.phoneNumber || 'No Phone',
              profileImageUrl: userData.profileImageUrl || null,
              userType: 'client',
            });
          }
        });
        setClients(clientsArray);
        console.log('Clients:', clientsArray);
      }
    });

    // Fetch service providers from both 'users' and 'serviceProviders' nodes
    const spRef = ref(database, 'serviceProviders');
    onValue(spRef, (snapshot) => {
      const spData = snapshot.val();
      const providersArray = [];
      
      if (spData) {
        Object.entries(spData).forEach(([id, userData]) => {
          providersArray.push({
            id,
            name: userData.name || 'No Name',
            email: userData.email || 'No Email',
            phoneNumber: userData.phoneNumber || 'No Phone',
            profileImageUrl: userData.profileImageUrl || null,
            userType: 'service provider',
            // Add any service provider specific fields
            services: userData.services || [],
            rating: userData.rating || 0,
            reviews: userData.reviews || [],
          });
        });
        setServiceProviders(providersArray);
        console.log('Service Providers:', providersArray);
      }
    });
  }, []);

  // Get the appropriate array based on selected user type
  const displayUsers = userType === 'client' ? clients : serviceProviders;

  const handleRemoveUser = async (user) => {
    try {
      const path = user.userType === 'client' ? 'users' : 'serviceProviders';
      const userRef = ref(database, `${path}/${user.id}`);
      
      // Show confirmation dialog
      if (window.confirm(`Are you sure you want to remove ${user.name}?`)) {
        await remove(userRef);
        toast.success(`${user.name} has been removed successfully`);
        setShowMenu(null); // Close the menu after removal
      }
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    }
  };

  return (
    <div className="users-management p-6">
      <h2 className="users-management__title text-2xl font-bold mb-4">User Information</h2>
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setUserType('client')} 
          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
            userType === 'client' 
              ? 'bg-violet-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Client ({clients.length})
        </button>
        <button 
          onClick={() => setUserType('service provider')} 
          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
            userType === 'service provider' 
              ? 'bg-violet-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Service Provider ({serviceProviders.length})
        </button>
      </div>

      <ul className="users-list bg-white rounded-lg shadow">
        {displayUsers.length > 0 ? (
          displayUsers.map((user) => (
            <li key={user.id} className="users-list__item flex items-center justify-between p-4 border-b last:border-b-0 relative">
              <div className="flex items-center">
                <div className="users-list__avatar w-10 h-10 rounded-full overflow-hidden mr-3">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">N/A</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="users-list__name font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                  {user.userType === 'service provider' && (
                    <span className="text-xs text-violet-600">
                      Rating: {user.rating || 'No ratings yet'}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <button 
                  className="text-gray-500 hover:text-gray-700" 
                  onClick={() => setShowMenu(showMenu === user.id ? null : user.id)}
                >
                  <MoreVertical size={20} />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu === user.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove User
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">
            No {userType}s found
          </li>
        )}
      </ul>
      
      {/* Toast notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default UsersManagement;
