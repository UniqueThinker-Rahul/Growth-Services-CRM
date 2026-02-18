import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import api from '../utils/api'; 
import toast from 'react-hot-toast'; 
import Skeleton from './Skeleton'; 

// --- TYPES ---
interface Lead {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  assigned: string;
  value: number;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
}

const Leads: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "role": "Guest"}');
  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

  // --- PERMISSION CHECKS ---
  const canCreate = ['Admin', 'Manager', 'Sales Rep', 'Administrator'].includes(user.role);
  const canEdit = ['Admin', 'Manager', 'Sales Rep', 'Administrator'].includes(user.role);
  // Only Admins and Managers can delete. Sales Reps cannot.
  const canDelete = ['Admin', 'Manager', 'Administrator'].includes(user.role);

  // --- STATE ---
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    _id: '', 
    name: '', 
    company: '', 
    email: '', 
    phone: '', 
    source: 'Manual Entry', 
    status: 'New', 
    assigned: 'Unassigned', 
    value: 0 
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const leadsRes = await api.get('/leads');
      if (Array.isArray(leadsRes.data)) setLeads(leadsRes.data);
      
      const teamRes = await api.get('/team');
      if (Array.isArray(teamRes.data)) setTeamMembers(teamRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- HANDLERS ---
  const handleEditClick = (lead: Lead) => {
    setFormData(lead); 
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setFormData({ _id: '', name: '', company: '', email: '', phone: '', source: 'Manual Entry', status: 'New', assigned: 'Unassigned', value: 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!formData._id;
    const url = isEditing ? `/leads/${formData._id}` : '/leads';
    
    const loadingToast = toast.loading(isEditing ? 'Updating lead...' : 'Creating lead...');

    try {
        const { _id, ...bodyData } = formData; 
        
        if (isEditing) {
            await api.put(url, bodyData);
            toast.success("Lead updated successfully!", { id: loadingToast });
        } else {
            await api.post(url, bodyData);
            toast.success("Lead created successfully!", { id: loadingToast });
        }
        
        await fetchData(); 
        setIsModalOpen(false);
    } catch (error: any) { 
        console.error('Error saving lead:', error);
        toast.error(error.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure?")) return;
    const loadingToast = toast.loading("Deleting lead...");
    
    try {
        await api.delete(`/leads/${id}`);
        setLeads(leads.filter(l => l._id !== id));
        toast.success("Lead deleted", { id: loadingToast });
    } catch (error: any) { 
        toast.error(error.response?.data?.message || "Could not delete lead", { id: loadingToast });
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
              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-sm">GS</div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Growth Service</span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a className="border-[#8B24C5] text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Leads</a>
                <Link to="/pipeline" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Pipeline</Link>
                <Link to="/analytics" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Reports</Link>
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
              <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate">Lead Management</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage incoming leads, track status, and assign follow-ups.</p>
            </div>
            
            {/* FIX: Hide "Add Lead" button if user can't create */}
            {canCreate && (
                <div className="mt-4 flex md:mt-0 md:ml-4">
                <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 focus:outline-none transition-colors">
                    <span className="material-icons-outlined text-sm mr-2">add</span> Add New Lead
                </button>
                </div>
            )}
          </div>

          <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? ( 
                <div className="p-4 space-y-4">
                   <Skeleton className="h-12 w-full" count={5} />
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                    <span className="material-icons-outlined text-4xl mb-2">inbox</span>
                    <p>No leads found. Add one to get started!</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {['Name', 'Email & Phone', 'Source', 'Status', 'Assigned To', 'Value', ''].map((header, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                    {leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-[#8B24C5] font-bold">
                                {getInitials(lead.name)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{lead.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900 dark:text-white">{lead.email}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{lead.source}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.status === 'Won' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{lead.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{lead.assigned}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-medium">₹{lead.value ? lead.value.toLocaleString('en-IN') : 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            
                            {/* FIX: Hide Edit Button if user can't Edit */}
                            {canEdit && (
                                <button onClick={() => handleEditClick(lead)} className="text-slate-400 hover:text-[#8B24C5] transition-colors"><span className="material-icons-outlined text-[20px]">edit</span></button>
                            )}
                            
                            {/* FIX: Hide Delete Button if user can't Delete (e.g., Sales Reps) */}
                            {canDelete && (
                                <button onClick={() => handleDelete(lead._id)} className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons-outlined text-[20px]">delete</span></button>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData._id ? "Edit Lead" : "Add New Lead"}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label><input type="text" required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white"><option>New</option><option>Contacted</option><option>Negotiation</option><option>Won</option></select></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deal Value (₹)</label><input type="number" value={formData.value} onChange={(e) => setFormData({...formData, value: Number(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Source</label><select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white"><option>Manual Entry</option><option>Website Form</option><option>Referral</option><option>LinkedIn</option></select></div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assigned To</label>
                  <select 
                    value={formData.assigned} 
                    onChange={(e) => setFormData({...formData, assigned: e.target.value})} 
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {teamMembers
                      .filter(m => ['Admin', 'Manager', 'Sales Rep', 'Administrator'].includes(m.role))
                      .map(member => (
                        <option key={member._id} value={member.name}>
                          {member.name} ({member.role})
                        </option>
                      ))
                    }
                  </select>
                </div>

            </div>
            <div className="mt-5 sm:mt-6 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:text-sm">Cancel</button>
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#8B24C5] text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:text-sm">{formData._id ? 'Update Lead' : 'Save Lead'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;