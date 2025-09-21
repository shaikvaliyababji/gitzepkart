import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../../config";

export default function ViewUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`${BASE_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded p-4 shadow flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
            <div className="w-24 h-24">
              <img
                src={`${BASE_URL}/images/${user.profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
