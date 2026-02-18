import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import secure API

interface Lead {
  _id: string;
  name: string;
  company: string;
  status: string;
  value: number;
  assigned: string;
  source: string;
}

const Pipeline: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "role": "Guest"}');
  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // 1. FETCH PIPELINE (Using secure 'api')
  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      if (Array.isArray(response.data)) {
          setLeads(response.data);
      } else {
          setLeads([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Stats Logic (Safe to run now that leads is guaranteed to be an array)
  const totalValue = leads.reduce((sum: number, lead) => sum + (Number(lead.value) || 0), 0);
  const wonValue = leads.filter(l => l.status === 'Won').reduce((sum: number, l) => sum + (Number(l.value) || 0), 0);
  const activeDeals = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length;
  const winRate = leads.length > 0 ? Math.round((leads.filter(l => l.status === 'Won').length / leads.length) * 100) : 0;

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    (e.target as HTMLElement).classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-50');
    setDraggedLeadId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  // 2. DROP & UPDATE (Using secure 'api')
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const updatedLeads = leads.map(l => 
        l._id === draggedLeadId ? { ...l, status: newStatus } : l
    );
    setLeads(updatedLeads);

    try {
        await api.put(`/leads/${draggedLeadId}`, { status: newStatus });
    } catch (error) {
        console.error("Failed to update status", error);
        fetchLeads(); 
    }
  };

  const handleLogout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) { console.error(e); }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const columns = [
    { title: 'New Leads', status: 'New', color: 'blue' },
    { title: 'Contacted', status: 'Contacted', color: 'yellow' },
    { title: 'Proposal Sent', status: 'Negotiation', color: 'purple' },
    { title: 'Closed Won', status: 'Won', color: 'green' }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display transition-colors duration-200 min-h-screen flex flex-col">
      <header className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => navigate(-1)} className="mr-2 p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors" title="Go Back">
                <span className="material-icons-outlined">arrow_back</span>
              </button>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-lg shadow-lg">G</div>
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Growth<span className="text-primary">Service</span> CRM</span>
              </div>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</Link>
                <a href="#" className="border-primary text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Pipeline</a>
                <Link to="/contacts" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Contacts</Link>
                <Link to="/analytics" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Reports</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                <span className="material-icons-outlined">notifications</span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs border border-gray-200 dark:border-gray-700">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-md shadow-lg py-1 border border-border-light dark:border-border-dark z-50">
                    <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-6">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Drag and drop cards to update deal status.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-outlined text-gray-400 text-lg">search</span>
                </div>
                <input className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-surface-dark dark:text-gray-200 rounded-md focus:ring-primary focus:border-primary shadow-sm h-10" placeholder="Search deals..." type="text"/>
              </div>
              <Link to="/leads" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary h-10 transition-colors">
                <span className="material-icons-outlined text-sm mr-2">add</span>
                Add Lead
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto kanban-scroll pb-4">
            <div className="flex space-x-6 min-w-full h-full items-start">
              {loading ? (
                  <div className="w-full text-center text-slate-500 mt-10">Loading pipeline data...</div>
              ) : (
                  columns.map((col, idx) => {
                    const colLeads = leads.filter(l => 
                        l.status === col.status || 
                        (col.status === 'Negotiation' && l.status === 'Proposal Sent') 
                    );
                    const colTotal = colLeads.reduce((sum: number, l) => sum + (Number(l.value) || 0), 0);

                    return (
                        <div key={idx} className="w-80 flex-shrink-0 flex flex-col bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 h-full border border-gray-200 dark:border-gray-700 transition-colors" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col.status)}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full bg-${col.color}-500`}></span>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{col.title}</h3>
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">{colLeads.length}</span>
                                </div>
                            </div>
                            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[100px]">
                                {colLeads.map((lead) => (
                                    <div key={lead._id} draggable="true" onDragStart={(e) => handleDragStart(e, lead._id)} onDragEnd={handleDragEnd} className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-grab hover:shadow-md transition-all duration-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-1 bg-${col.color}-100 dark:bg-${col.color}-900/30 text-${col.color}-700 dark:text-${col.color}-300 text-xs font-semibold rounded`}>
                                                {lead.source || 'Lead'}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{lead.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{lead.company}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-200 border-2 border-white dark:border-gray-800">
                                                    {lead.assigned ? lead.assigned.substring(0,2).toUpperCase() : 'NA'}
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white text-sm">₹{lead.value ? lead.value.toLocaleString('en-IN') : 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-right text-xs font-medium text-slate-500">
                                Total: ₹{colTotal.toLocaleString('en-IN')}
                            </div>
                        </div>
                    );
                  })
              )}
              <div className="w-80 flex-shrink-0 flex flex-col justify-center items-center rounded-xl p-4 h-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer group">
                <span className="material-icons-outlined text-4xl text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 mb-2">add</span>
                <span className="text-gray-400 dark:text-gray-500 font-medium group-hover:text-gray-500 dark:group-hover:text-gray-400">Add Stage</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pb-6">
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Pipeline Value</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₹{totalValue.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <span className="material-icons-outlined text-primary">currency_rupee</span>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Active Deals</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{activeDeals}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <span className="material-icons-outlined text-blue-600 dark:text-blue-400">trending_up</span>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Win Rate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{winRate}%</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <span className="material-icons-outlined text-green-600 dark:text-green-400">emoji_events</span>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Won Revenue</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₹{wonValue.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <span className="material-icons-outlined text-purple-600 dark:text-purple-400">pie_chart</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pipeline;