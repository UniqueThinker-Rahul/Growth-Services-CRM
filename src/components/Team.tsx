import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from './Modal';
import api from '../utils/api'; 
import toast from 'react-hot-toast'; 
import Skeleton from './Skeleton'; 

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  deals: number;
  value: number;
  avatar: string;
  color: string;
}

const Team: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "role": "Guest"}');
  const getInitials = (name: string) => name ? name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() : '??';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default role is now Sales Rep
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Sales Rep', password: '' });

  const fetchTeam = async () => {
    try {
      const response = await api.get('/team');
      if (Array.isArray(response.data)) {
          setTeamMembers(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error("Failed to load team");
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sending invitation...");
    
    try {
        await api.post('/team', newMember);
        toast.success("Invitation sent!", { id: loadingToast });
        setNewMember({ name: '', email: '', role: 'Sales Rep', password: '' });
        setIsModalOpen(false);
        await fetchTeam();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to invite", { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Remove this team member?")) return;
    try {
        await api.delete(`/team/${id}`);
        toast.success("Team member removed");
        setTeamMembers(teamMembers.filter(m => m._id !== id));
    } catch (error) {
        toast.error("Failed to delete member");
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) { console.error(e); }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans antialiased min-h-screen transition-colors duration-200">
      
      <nav className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="mr-2 p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"><span className="material-icons-outlined">arrow_back</span></button>
              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-sm">GS</div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Growth Service</span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/dashboard" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</Link>
                <a href="#" className="border-[#8B24C5] text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Team</a>
                <Link to="/settings" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Settings</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative ml-3">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 focus:outline-none p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">{getInitials(user.name)}</div>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-md shadow-lg py-1 border border-border-light dark:border-border-dark z-50">
                    <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">Sign Out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate">Team Management</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your team members, assign roles, and track performance.</p>
            </div>
            {(user.role === 'Admin' || user.role === 'Administrator' || user.role === 'Manager') && (
                <div className="mt-4 flex md:mt-0 md:ml-4">
                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 focus:outline-none transition-colors">
                    <span className="material-icons-outlined text-sm mr-2">person_add</span> Invite Member
                </button>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
                <><Skeleton className="h-64" /><Skeleton className="h-64" /><Skeleton className="h-64" /></>
            ) : teamMembers.map((member) => (
              <div key={member._id} className="bg-surface-light dark:bg-surface-dark rounded-lg shadow border border-border-light dark:border-border-dark p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative group">
                {(user.role === 'Admin' || user.role === 'Administrator') && member.role !== 'Admin' && (
                    <button onClick={() => handleDelete(member._id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Member"><span className="material-icons-outlined text-lg">delete</span></button>
                )}
                <div className="relative">
                  <div className={`h-20 w-20 rounded-full bg-${member.color || 'blue'}-100 dark:bg-${member.color || 'blue'}-900/30 flex items-center justify-center text-${member.color || 'blue'}-700 dark:text-${member.color || 'blue'}-300 text-2xl font-bold mb-4`}>{member.avatar}</div>
                  <span className={`absolute bottom-4 right-0 block h-4 w-4 rounded-full ring-2 ring-white dark:ring-surface-dark ${member.status === 'Active' ? 'bg-green-400' : 'bg-slate-400'}`} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{member.role}</p>
                <p className="text-xs text-slate-400 mb-6">{member.email}</p>
                <div className="grid grid-cols-2 gap-4 w-full border-t border-border-light dark:border-border-dark pt-4 mb-6">
                  <div><p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Deals</p><p className="text-lg font-bold text-slate-900 dark:text-white">{member.deals}</p></div>
                  <div><p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Value</p><p className="text-lg font-bold text-slate-900 dark:text-white">₹{member.value ? member.value.toLocaleString('en-IN') : 0}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label><input type="text" required value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label><input type="email" required value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white" /></div>
            
            {/* --- FIX: Added 'Support' and 'Viewer' options here --- */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <select 
                value={newMember.role} 
                onChange={(e) => setNewMember({...newMember, role: e.target.value})} 
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white"
              >
                <option value="Sales Rep">Sales Rep</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
                <option value="Support">Support</option>
                <option value="Viewer">Viewer</option>
                <option value="Developer">Developer</option> {/* Added */}
              </select>
            </div>
            
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Set Password</label><input type="password" required value={newMember.password} onChange={(e) => setNewMember({...newMember, password: e.target.value})} placeholder="Min. 6 characters" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div className="mt-5 sm:mt-6 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:text-sm">Cancel</button>
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#8B24C5] text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:text-sm">Send Invitation</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;