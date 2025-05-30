import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserManager = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const API_URL = `${process.env.REACT_APP_API_URL}/users`;

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin-user-list`);
      setUsers(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching users');
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await axios.put(`${API_URL}/update-role/${userId}`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating role');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center mt-8">Access denied. Admin only.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <p className="text-sm text-gray-600">Created: {new Date(user.createdAt).toLocaleString()}</p>
            </div>
            <select
              value={user.role}
              onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
              className="p-2 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;