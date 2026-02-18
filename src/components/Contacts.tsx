import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal'; 
import api from '../utils/api';
import toast from 'react-hot-toast';
import Skeleton from './Skeleton';

interface Contact {
  _id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  status: string;
  lastContact: string;
}

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "role": "Guest"}');
  const getInitials = (name: string) => name ? name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() : '??';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({ name: '', role: '', company: '', email: '' });

  // 1. FETCH CONTACTS (Secure)
  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      if (Array.isArray(response.data)) setContacts(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load contacts");
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  // 2. ADD CONTACT (Secure)
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post('/contacts', newContact);
        toast.success("Contact added successfully");
        await fetchContacts();
        setNewContact({ name: '', role: '', company: '', email: '' });
        setIsModalOpen(false);
    } catch (error) {
        toast.error("Failed to add contact");
    }
  };

  // 3. DELETE CONTACT (Secure)
  const handleDelete = async (id: string) => {
    if(!window.confirm("Delete this contact?")) return;
    try {
        await api.delete(`/contacts/${id}`);
        toast.success("Contact deleted");
        setContacts(contacts.filter(c => c._id !== id));
    } catch (error) {
        toast.error("Failed to delete contact");
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
      
      {/* Navbar (Standardized) */}
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
                <Link to="/pipeline" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Pipeline</Link>
                <a href="#" className="border-[#8B24C5] text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Contacts</a>
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
              <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate">Client Contacts</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A directory of all your established clients and points of contact.</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
              <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 focus:outline-none transition-colors">
                <span className="material-icons-outlined text-sm mr-2">add</span> Add Contact
              </button>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-4"><Skeleton className="h-12" count={5} /></div>
              ) : contacts.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No contacts found.</div>
              ) : (
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {['Name', 'Company', 'Status', 'Last Contacted', 'Email', ''].map((header, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="h-10 w-10 flex-shrink-0"><div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold text-sm">{getInitials(contact.name)}</div></div><div className="ml-4"><div className="text-sm font-medium text-slate-900 dark:text-white">{contact.name}</div><div className="text-sm text-slate-500 dark:text-slate-400">{contact.role}</div></div></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-900 dark:text-white">{contact.company}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{contact.lastContact || 'Never'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{contact.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDelete(contact._id)} className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons-outlined text-[20px]">delete</span></button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Contact">
        <form onSubmit={handleAddContact} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label><input type="text" required value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label><input type="text" required value={newContact.role} onChange={(e) => setNewContact({...newContact, role: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label><input type="text" required value={newContact.company} onChange={(e) => setNewContact({...newContact, company: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label><input type="email" required value={newContact.email} onChange={(e) => setNewContact({...newContact, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2 border dark:bg-slate-700 dark:text-white" /></div>
            <div className="mt-5 sm:mt-6 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none sm:text-sm">Cancel</button>
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#8B24C5] text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:text-sm">Save Contact</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Contacts;