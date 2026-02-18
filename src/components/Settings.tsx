import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. GET USER FROM LOCAL STORAGE (Dynamic Data)
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "email": "user@growth.io", "role": "Guest"}');
  
  // Helper to get initials
  const getInitials = (name: string) => name ? name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() : '??';

  // Theme check on load
  useEffect(() => {
    const isDark = localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark')
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        setIsDarkMode(false);
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        setIsDarkMode(true);
    }
  };

  const tabs = [
    { name: 'Profile', icon: 'person' },
    { name: 'Account', icon: 'manage_accounts' },
    { name: 'Notifications', icon: 'notifications' },
    { name: 'Appearance', icon: 'palette' },
  ];

  // 2. UPDATED LOGOUT (Clear Token)
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Clear the security token
    navigate('/login');
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
                <Link to="/dashboard" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</Link>
                <Link to="/team" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Team</Link>
                <a href="#" className="border-[#8B24C5] text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Settings</a>
              </div>
            </div>
            
            {/* UPDATED: Dynamic Header Profile */}
            <div className="flex items-center gap-4">
              <div className="relative ml-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                    {getInitials(user.name)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg border border-border-light dark:border-border-dark overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-border-light dark:border-border-dark">
              <nav className="flex flex-col p-4 space-y-1 h-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.name 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-[#8B24C5] dark:text-purple-300' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="material-icons-outlined text-lg mr-3">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
                <div className="flex-grow"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-auto"
                >
                  <span className="material-icons-outlined text-lg mr-3">logout</span>
                  Sign Out
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8">
              
              {/* Profile Tab - UPDATED DYNAMIC DATA */}
              {activeTab === 'Profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Profile Information</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your account's profile information and email address.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Photo</label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-500">
                                {getInitials(user.name)}
                            </div>
                            <button className="bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Change</button>
                        </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                      <input type="text" defaultValue={user.name} className="mt-1 block w-full rounded-md border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-[#8B24C5] focus:ring-[#8B24C5] sm:text-sm p-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                      <input type="text" defaultValue={user.role} disabled className="mt-1 block w-full rounded-md border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 shadow-sm sm:text-sm p-2 border cursor-not-allowed" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                      <input type="email" defaultValue={user.email} disabled className="mt-1 block w-full rounded-md border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 shadow-sm sm:text-sm p-2 border cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-end">
                    <button className="bg-[#8B24C5] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">Save Changes</button>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'Account' && (
                <div className="space-y-6">
                   <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Account Security</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your password and security preferences.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                      <input type="password" className="mt-1 block w-full rounded-md border-border-light dark:border-border-dark bg-white dark:bg-slate-800 p-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                      <input type="password" className="mt-1 block w-full rounded-md border-border-light dark:border-border-dark bg-white dark:bg-slate-800 p-2 border" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-end">
                    <button className="bg-[#8B24C5] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">Update Password</button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'Notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Notifications</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Decide which communications you'd like to receive.</p>
                  </div>
                  <div className="space-y-4">
                    {['Email me when a new lead is added', 'Email me when a task is overdue', 'Send push notifications for mentions'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                            <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#8B24C5] transition-colors duration-200 ease-in-out focus:outline-none">
                                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                            </button>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'Appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Theme Settings</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Customize the look and feel of the dashboard.</p>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-border-light dark:border-border-dark">
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark themes.</p>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDarkMode ? 'bg-[#8B24C5]' : 'bg-slate-200'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;