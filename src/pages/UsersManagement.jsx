import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'react-feather';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);

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
        <button>Client</button>
        <button>Service Provider</button>
      </div>

      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id} className="users-list__item flex items-center justify-between p-3 border-b">
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
              <span className="users-list__name">{user.name}</span>
            </div>
            <button className="users-list__more-options" aria-label="more options">
              <MoreVertical size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;
