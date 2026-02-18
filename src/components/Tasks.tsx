import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Import the shared Modal

// Define interface for Task data from MongoDB
interface Task {
  _id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  due: string;
  lead: string;
}

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  
  // Theme check
  useEffect(() => {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark')
    }
  }, []);

  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Tasks (Fetched from Backend)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // State for New Task Form
  const [newTask, setNewTask] = useState({ title: '', type: 'Call', priority: 'Medium', lead: '', due: 'Today' });

  // 1. FETCH TASKS FROM BACKEND
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. HANDLE ADDING TASK (POST)
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newTask, status: 'Pending' }),
        });

        if (response.ok) {
            await fetchTasks(); // Refresh list
            setNewTask({ title: '', type: 'Call', priority: 'Medium', lead: '', due: 'Today' });
            setIsModalOpen(false);
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
  };

  // 3. TOGGLE STATUS (PUT)
  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
        const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (response.ok) {
            fetchTasks(); 
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
  };

  // 4. DELETE TASK (DELETE)
  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this task?")) return;
    try {
        await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans antialiased min-h-screen transition-colors duration-200">
      
      {/* Navigation Bar */}
      <nav className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="mr-2 p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                title="Go Back"
              >
                <span className="material-icons-outlined">arrow_back</span>
              </button>

              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-sm">GS</div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Growth Service</span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/leads" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Leads</Link>
                <a href="#" className="border-[#8B24C5] text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Tasks</a>
                <Link to="/analytics" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Analytics</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-1 rounded-full text-slate-400 hover:text-[#8B24C5] focus:outline-none">
                <span className="material-icons-outlined">notifications</span>
              </button>
              <div className="relative ml-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium hidden sm:block">Admin User</span>
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">AU</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate">
                My Tasks
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Track your daily to-dos and follow-ups.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B24C5] transition-colors"
              >
                <span className="material-icons-outlined text-sm mr-2">add_task</span>
                Create Task
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {['All', 'High Priority', 'Completed'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                  filter === f 
                  ? 'bg-[#8B24C5] text-white border-[#8B24C5]' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border-light dark:border-border-dark hover:border-[#8B24C5]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
            {loading ? (
                <div className="p-12 text-center text-slate-500">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                    <span className="material-icons-outlined text-4xl mb-2">task_alt</span>
                    <p>No tasks found. Create one!</p>
                </div>
            ) : (
                <ul className="divide-y divide-border-light dark:divide-border-dark">
                {tasks
                    .filter(t => filter === 'All' ? true : filter === 'Completed' ? t.status === 'Completed' : t.priority === 'High')
                    .map((task) => (
                    <li key={task._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-start gap-4">
                        <button 
                            onClick={() => toggleStatus(task)}
                            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            task.status === 'Completed' 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-slate-300 dark:border-slate-600 hover:border-[#8B24C5]'
                            }`}
                        >
                        {task.status === 'Completed' && <span className="material-icons-outlined text-xs">check</span>}
                        </button>
                        <div>
                        <p className={`text-sm font-medium ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                            {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                            <span className="material-icons-outlined text-[14px]">business</span> {task.lead || 'General'}
                            </span>
                            <span className="flex items-center gap-1">
                            <span className="material-icons-outlined text-[14px]">event</span> {task.due}
                            </span>
                        </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pl-9 sm:pl-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                        ${task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' : 
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'}`}>
                        {task.priority}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {task.type}
                        </span>
                        <button className="text-slate-400 hover:text-[#8B24C5] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons-outlined">edit</span>
                        </button>
                        <button 
                            onClick={() => handleDelete(task._id)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                        <span className="material-icons-outlined">delete</span>
                        </button>
                    </div>
                    </li>
                ))}
                </ul>
            )}
          </div>

        </div>
      </main>

      {/* Mobile FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#8B24C5] text-white shadow-lg flex items-center justify-center hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B24C5] z-50"
      >
        <span className="material-icons-outlined">add</span>
      </button>

      {/* --- ADD TASK MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleAddTask} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Task Title</label>
                <input 
                    type="text" 
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g. Call Client X"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#8B24C5] focus:ring-[#8B24C5] sm:text-sm p-2 border dark:bg-slate-700 dark:text-white"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                    <select 
                        value={newTask.type}
                        onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#8B24C5] focus:ring-[#8B24C5] sm:text-sm p-2 border dark:bg-slate-700 dark:text-white"
                    >
                        <option>Call</option>
                        <option>Email</option>
                        <option>Meeting</option>
                        <option>Document</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                    <select 
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#8B24C5] focus:ring-[#8B24C5] sm:text-sm p-2 border dark:bg-slate-700 dark:text-white"
                    >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
                <input 
                    type="text" 
                    value={newTask.due}
                    onChange={(e) => setNewTask({...newTask, due: e.target.value})}
                    placeholder="e.g. Tomorrow"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#8B24C5] focus:ring-[#8B24C5] sm:text-sm p-2 border dark:bg-slate-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Related Lead (Optional)</label>
                <input 
                    type="text" 
                    value={newTask.lead}
                    onChange={(e) => setNewTask({...newTask, lead: e.target.value})}
                    placeholder="Search leads..."
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#8B24C5] focus:ring-[#8B24C5] sm:text-sm p-2 border dark:bg-slate-700 dark:text-white"
                />
            </div>

            <div className="mt-5 sm:mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#8B24C5] text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B24C5] sm:text-sm"
                >
                  Save Task
                </button>
            </div>
        </form>
      </Modal>

    </div>
  );
};

export default Tasks;