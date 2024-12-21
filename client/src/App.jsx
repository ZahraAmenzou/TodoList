import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add or Update Todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      try {
        await axios.put(`${API_URL}/${editId}`, { text });
        setEditId(null);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    } else {
      try {
        await axios.post(API_URL, { text });
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
    setText('');
    fetchTodos();
  };

  // Delete Todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Edit Todo
  const handleEdit = (todo) => {
    setText(todo.text);
    setEditId(todo._id);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button className={`btn btn-${editId ? 'warning' : 'primary'}`} type="submit">
            {editId ? 'Update' : 'Add'}
          </button>
        </div>
      </form>

      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(todo)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(todo._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
