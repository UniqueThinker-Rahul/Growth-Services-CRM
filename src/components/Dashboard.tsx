import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal'; 
import api from '../utils/api';
import Skeleton from './Skeleton'; 

interface AnalyticsData {
  totalRevenue: number;
  totalLeads: number;
  wonDeals: number;
  winRate: number;
}

interface Lead {
  _id: string;
  name: string;
  company: string;
  status: string;
  value: number;
  email: string;
}

interface TeamMember {
  _id: string;
  name: string;
  deals: number;
  avatar: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "role": "Guest"}');
  const getInitials = (name: string) => name ? name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() : '??';

  // --- THE FIX: Case-Insensitive Role Checker ---
  const hasRole = (roles: string[]) => roles.some(r => r.toLowerCase() === (user.role || '').toLowerCase());

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [stats, setStats] = useState<AnalyticsData>({ totalRevenue: 0, totalLeads: 0, wonDeals: 0, winRate: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLead, setNewLead] = useState({ name: '', company: '', email: '', value: '' });

  useEffect(() => {
    // FIX 1: Ensure function name matches the call below
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes, teamRes] = await Promise.all([
            api.get('/analytics'),
            api.get('/leads'),
            api.get('/team')
        ]);

        setStats(statsRes.data);
        if (Array.isArray(leadsRes.data)) setRecentLeads(leadsRes.data.slice(0, 5));
        if (Array.isArray(teamRes.data)) setTeam(teamRes.data.slice(0, 3));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // FIX 2: Changed from fetchDashboardData() to fetchData() to match line 50
    fetchData();
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post('/leads', newLead);
        window.location.reload(); 
    } catch (error) { console.error(error); }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) { console.error(e); }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark antialiased transition-colors duration-200 h-screen flex overflow-hidden">
      
      {/* Sidebar with Role Protection */}
      <aside className={`w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 flex flex-col fixed md:relative z-30 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-sm">GS</div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B24C5] to-[#D946EF]">GrowthService</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-purple-50 text-[#8B24C5] dark:bg-purple-900/20 dark:text-purple-300 group"><span className="material-icons-outlined mr-3 text-lg">dashboard</span>Dashboard</Link>
          
          {hasRole(['Admin', 'Manager', 'Sales Rep']) && <Link to="/leads" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group transition-colors"><span className="material-icons-outlined mr-3 text-lg text-gray-400 group-hover:text-gray-500">person_add</span>Leads</Link>}
          {hasRole(['Admin', 'Manager', 'Sales Rep']) && <Link to="/pipeline" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group transition-colors"><span className="material-icons-outlined mr-3 text-lg text-gray-400 group-hover:text-gray-500">view_kanban</span>Pipeline</Link>}
          {hasRole(['Admin', 'Manager', 'Support']) && <Link to="/contacts" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group transition-colors"><span className="material-icons-outlined mr-3 text-lg text-gray-400 group-hover:text-gray-500">contacts</span>Contacts</Link>}
          
          {hasRole(['Admin', 'Manager']) && (
              <>
                <div className="pt-4 pb-1 pl-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Management</div>
                <Link to="/team" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group transition-colors"><span className="material-icons-outlined mr-3 text-lg text-gray-400 group-hover:text-gray-500">groups</span>Team</Link>
                <Link to="/analytics" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group transition-colors"><span className="material-icons-outlined mr-3 text-lg text-gray-400 group-hover:text-gray-500">insights</span>Analytics</Link>
              </>
          )}

          <div className="pt-4 pb-1 pl-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">System</div>
          {hasRole(['Admin', 'Administrator']) && (<Link to="/logs" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group transition-colors"><span className="material-icons-outlined mr-3 text-lg text-gray-400 group-hover:text-gray-500">list_alt</span>Activity Logs</Link>)}
          <Link to="/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group transition-colors"><span className="material-icons-outlined mr-3 text-lg text-gray-400 group-hover:text-gray-500">settings</span>Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-light dark:bg-background-dark">
        {/* Header (Same as before) */}
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 transition-colors duration-200 relative z-20">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-500"><span className="material-icons-outlined">menu</span></button>
          <div className="flex-1 px-4 max-w-lg hidden md:block"><input className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:text-white sm:text-sm" placeholder="Search..." type="text"/></div>
          <div className="flex items-center gap-4">
            <span className="material-icons-outlined text-gray-400 cursor-pointer">notifications</span>
            <div className="relative">
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs border border-gray-200 dark:border-gray-700">{getInitials(user.name)}</div>
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-md shadow-lg py-1 border border-border-light dark:border-border-dark z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700"><p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">Dashboard Overview</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name.split(' ')[0]}. Here's your real-time data.</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-800 focus:outline-none transition-colors"><span className="material-icons-outlined text-lg mr-2">add</span> Add New Lead</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 2. LOADING STATE: SKELETONS FOR CARDS */}
            {loading ? (
                <>
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </>
            ) : (
                <>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"><div className="flex justify-between"><div><p className="text-sm font-medium text-gray-500">Total Leads</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</p></div><div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><span className="material-icons-outlined text-blue-600">group</span></div></div></div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"><div className="flex justify-between"><div><p className="text-sm font-medium text-gray-500">Revenue</p><p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString('en-IN')}</p></div><div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"><span className="material-icons-outlined text-green-600">currency_rupee</span></div></div></div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"><div className="flex justify-between"><div><p className="text-sm font-medium text-gray-500">Won Deals</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.wonDeals}</p></div><div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"><span className="material-icons-outlined text-orange-600">emoji_events</span></div></div></div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"><div className="flex justify-between"><div><p className="text-sm font-medium text-gray-500">Conversion Rate</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.winRate}%</p></div><div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"><span className="material-icons-outlined text-purple-600">pie_chart</span></div></div></div>
                </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leads</h3>
                <Link to="/leads" className="text-sm font-medium text-[#8B24C5] hover:text-purple-700">View All</Link>
              </div>
              <div className="overflow-x-auto">
                {/* 3. LOADING STATE: TABLE SKELETON */}
                {loading ? (
                    <div className="p-4 space-y-4">
                        <Skeleton className="h-12" count={5} />
                    </div>
                ) : recentLeads.length === 0 ? (
                    /* 4. EMPTY STATE */
                    <div className="p-10 text-center flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                            <span className="material-icons-outlined text-gray-400 text-3xl">inbox</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No leads found.</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-2 text-[#8B24C5] font-medium hover:underline">Create your first lead</button>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentLeads.map((lead) => (
                          <tr key={lead._id}>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-xs text-purple-600">{getInitials(lead.name)}</div><div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div><div className="text-sm text-gray-500">{lead.email}</div></div></div></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.company}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.status === 'Won' ? 'bg-green-100 text-green-800' : lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{lead.status}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{lead.value ? lead.value.toLocaleString('en-IN') : 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                )}
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance</h3>
              <div className="space-y-6">
                {loading ? (
                    <Skeleton className="h-10" count={3} />
                ) : team.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        <p>No team members.</p>
                        <Link to="/team" className="text-sm text-[#8B24C5] hover:underline">Invite someone</Link>
                    </div>
                ) : (
                    team.map((member) => (
                      <div key={member._id} className="flex items-center">
                        <div className={`h-10 w-10 rounded-full bg-${member.color || 'blue'}-100 flex items-center justify-center text-xs font-bold text-gray-700`}>{member.avatar}</div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{member.name}</span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{member.deals} Deals</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div className="bg-[#8B24C5] h-1.5 rounded-full" style={{ width: `${Math.min(member.deals * 5, 100)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Lead">
        <form onSubmit={handleAddLead} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label><input type="text" required value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label><input type="text" required value={newLead.company} onChange={(e) => setNewLead({...newLead, company: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label><input type="email" required value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Potential Value (₹)</label><input type="number" required value={newLead.value} onChange={(e) => setNewLead({...newLead, value: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div className="mt-5 sm:mt-6 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:text-sm">Cancel</button>
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#8B24C5] text-base font-medium text-white hover:bg-purple-800 focus:outline-none sm:text-sm">Save Lead</button>
            </div>
        </form>
      </Modal>

    </div>
  );
};

export default Dashboard;
