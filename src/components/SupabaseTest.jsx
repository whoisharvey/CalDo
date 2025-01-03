import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

function SupabaseTest() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*');

        if (error) {
          setError(error.message);
        } else {
          setTasks(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title: 'Test Task', time: new Date().toISOString(), completed: false }])
        .select();

      if (error) {
        setError(error.message);
      } else {
        setTasks([...tasks, ...data]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Tasks from Supabase:</h2>
      <button onClick={handleAddTask}>Add Test Task</button>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {task.title} - {task.completed ? 'Completed' : 'Pending'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupabaseTest;
