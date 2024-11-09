import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'react-feather';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState('Client');

  useEffect(() => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedUsers = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
          avatar: data[key].profileImageUrl,
          type: data[key].userType,
        }));
        setUsers(formattedUsers);
      } else {
        setUsers([]);
      }
    });
  }, []);

  return (
    <div className="users-management p-6">
      <h2 className="users-management__title text-2xl font-bold mb-4">User Information</h2>
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setUserType('Client')} 
          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
            userType === 'Client' 
              ? 'bg-violet-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Client
        </button>
        <button 
          onClick={() => setUserType('Service Provider')} 
          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
            userType === 'Service Provider' 
              ? 'bg-violet-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Service Provider
        </button>
      </div>

      <ul className="users-list bg-white rounded-lg shadow">
        {users.map((user) => (
          <li key={user.id} className="users-list__item flex items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex items-center">
              <div className="users-list__avatar w-10 h-10 rounded-full overflow-hidden mr-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">N/A</span>
                  </div>
                )}
              </div>
              <span className="users-list__name font-medium">{user.name}</span>
            </div>
            <button className="users-list__more-options text-gray-500 hover:text-gray-700" aria-label="more options">
              <MoreVertical size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;
