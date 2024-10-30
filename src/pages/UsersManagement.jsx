import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'react-feather';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('client');

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

  const filteredUsers = users.filter(user => 
    activeTab === 'client' ? user.type === 'client' : user.type === 'provider'
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#6B46C1] mb-4">User Information</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'client'
                ? 'bg-[#6B46C1] text-white'
                : 'bg-[#EDE9FE] text-[#6B46C1]'
            }`}
            onClick={() => setActiveTab('client')}
          >
            Client
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'provider'
                ? 'bg-[#6B46C1] text-white'
                : 'bg-[#EDE9FE] text-[#6B46C1]'
            }`}
            onClick={() => setActiveTab('provider')}
          >
            Service Provider
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="font-medium text-gray-700">{user.name}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;
