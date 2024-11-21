import React, { useEffect, useState } from 'react';
import { MoreVertical, Trash2 } from 'react-feather';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UsersManagement = () => {
  const [clients, setClients] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [userType, setUserType] = useState('client');
  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch users from 'users' node
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const clientsArray = [];
      const providersArray = [];

      if (data) {
        Object.entries(data).forEach(([id, userData]) => {
          // Check roles to categorize users
          if (userData.roles && userData.roles.includes('Client')) {
            clientsArray.push({
              id,
              name: userData.name || 'No Name',
              email: userData.email || 'No Email',
              phoneNumber: userData.phoneNumber || 'No Phone',
              profileImageUrl: userData.profileImageUrl || null,
              userType: 'client',
              status: userData.status || 'active',
            });
          }
          if (userData.roles && userData.roles.includes('Service Provider')) {
            providersArray.push({
              id,
              name: userData.name || 'No Name',
              email: userData.email || 'No Email',
              phoneNumber: userData.phoneNumber || 'No Phone',
              profileImageUrl: userData.profileImageUrl || null,
              userType: 'service provider',
              services: userData.services || [],
              rating: userData.rating || 0,
              reviews: userData.reviews || [],
              status: userData.status || 'active',
            });
          }
        });
        setClients(clientsArray);
        setServiceProviders(providersArray);
        console.log('Fetched Clients:', clientsArray.length);
        console.log('Fetched Service Providers:', providersArray.length);
      }
    });
  }, []);

  // Get the appropriate array based on selected user type
  const displayUsers = userType === 'client' ? clients : serviceProviders;

  const handleToggleUserStatus = async () => {
    if (!selectedUser) return;

    try {
      const path = selectedUser.userType === 'client' ? 'users' : 'serviceProviders';
      const userRef = ref(database, `${path}/${selectedUser.id}`);
      
      // Update user status
      const newStatus = selectedUser.status === 'active' ? 'disabled' : 'active';
      await update(userRef, { status: newStatus });

      // Disable user authentication if the user is being disabled
      if (newStatus === 'disabled') {
        await disableUserInAuth(selectedUser.id); // Call to disable user in Firebase Auth
      }

      // Show toast notification only when enabling a user
      if (newStatus === 'active') {
        toast.success(`${selectedUser.name} has been enabled successfully`);
      }
      
      setShowModal(false); // Close the modal after status change
      setShowMenu(null); // Close the menu after status change
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to change user status'); // Keep this for error handling
    }
  };

  // Function to disable user in Firebase Authentication
  const disableUserInAuth = async (userId) => {
    try {
      await axios.post('/disableUser', { userId }); // Ensure this endpoint is set up on your server
    } catch (error) {
      console.error('Error disabling user in auth:', error);
      toast.error('Failed to disable user in authentication');
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
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        user.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Trash2 size={16} className="mr-2" />
                      {user.status === 'active' ? 'Disable User' : 'Enable User'}
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md text-center w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to {selectedUser?.status === 'active' ? 'disable' : 'enable'} {selectedUser?.name}?
            </h2>
            <div className="flex space-x-2 justify-center">
              <button 
                onClick={handleToggleUserStatus}
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Confirm
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default UsersManagement;
