import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: '', category: '' });
  const [editTask, setEditTask] = useState(null); // Track the task being edited
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://mern-curd-app-backend.onrender.com/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editTask) {
        // If editTask is null, it means we're adding a new task
        await axios.post('https://mern-curd-app-backend.onrender.com/tasks', newTask);
      } else {
        // If editTask is not null, it means we're editing an existing task
        await axios.put(`https://mern-curd-app-backend.onrender.com/tasks/${editTask._id}`, newTask);
        setEditTask(null); // Clear editTask after editing is done
      }
      setNewTask({ title: '', description: '', priority: '', category: '' });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    // Set the task to be edited and populate the form fields with its data
    setEditTask(task);
    setNewTask(task);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://mern-curd-app-backend.onrender.com/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Task Manager</h1>
      <div className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="border border-gray-400 rounded px-3 py-2 mb-2" />
          <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="border border-gray-400 rounded px-3 py-2 mb-2" />
          <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="border border-gray-400 rounded px-3 py-2 mb-2">
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input type="text" placeholder="Category" value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} className="border border-gray-400 rounded px-3 py-2 mb-2" />
        </div>
        <button type="submit" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">{editTask ? 'Update Task' : 'Add Task'}</button>
      </div>
      {/* Filter inputs */}
      <div className="flex items-center mb-4">
        <label className="mr-2">Filter by Priority:</label>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border border-gray-400 rounded px-3 py-2">
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="flex items-center mb-4">
        <label className="mr-2">Filter by Category:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border border-gray-400 rounded px-3 py-2">
          <option value="">All</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        <ul>
  {tasks
    .filter(task => {
      if (filterPriority && task.priority !== filterPriority) {
        return false; // Exclude task if filterPriority is selected and task's priority doesn't match
      }
      if (filterCategory && task.category !== filterCategory) {
        return false; // Exclude task if filterCategory is selected and task's category doesn't match
      }
      return true; // Include task if it passes all filters or if no filters are applied
    })
    .map(task => (
      <li key={task._id} className="mb-4 p-4 bg-white shadow-md rounded">
        <strong className="block text-xl mb-2">{task.title}</strong>
        <p className="text-gray-700 mb-2">{task.description}</p>
        <div className="flex items-center mb-2">
          <span className={`px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'} text-white mr-2`}>{task.priority}</span>
          <span className="text-gray-700">{task.category}</span>
        </div>
        <div>
          <button onClick={() => handleEdit(task)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
          <button onClick={() => handleDelete(task._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
        </div>
      </li>
    ))}
</ul>
      </div>
    </div>
  );
};

export default App;
