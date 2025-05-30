import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TaskManager = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const API_URL = `${process.env.REACT_APP_API_URL}/tasks`;

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-all`);
      setTasks(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching tasks');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await axios.put(`${API_URL}/update/${editingId}`, { title, description, status });
        setTasks(tasks.map(task => task._id === editingId ? response.data : task));
        setEditingId(null);
      } else {
        const response = await axios.post(`${API_URL}/create`, { title, description, status });
        setTasks([...tasks, response.data]);
      }
      setTitle('');
      setDescription('');
      setStatus('pending');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEditingId(task._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting task');
    }
  };

  if (!user) {
    return <div className="text-center mt-8">Please log in to view tasks.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Task' : 'Create Task'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {(user.role === 'admin' || user.role === 'editor') && (
        <form onSubmit={handleSubmit} className="mb-8 max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {editingId ? 'Update Task' : 'Add Task'}
          </button>
        </form>
      )}
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task._id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">Status: {task.status}</p>
            </div>
            {(user.role === 'admin' || user.role === 'editor') && (
              <div>
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;