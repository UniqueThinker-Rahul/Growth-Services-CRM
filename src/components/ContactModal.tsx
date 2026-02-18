import React, { useState } from 'react';
import api from '../utils/api'; // Import your secure API
import toast from 'react-hot-toast'; // Import the toaster we added

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    help: 'I need a new website'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Submitting your request...');

    try {
      // CHANGE THIS LINE: Use '/leads/public' instead of '/leads'
      await api.post('/leads/public', { 
        name: formData.name,
        email: formData.email,
        company: formData.website || 'Website Visitor', // Map website to company
        help: formData.help // You might want to save this description too if your DB supports it
      });

      toast.success("Request received! We'll contact you soon.", { id: loadingToast });
      setFormData({ name: '', email: '', website: '', help: 'I need a new website' }); 
      setTimeout(onClose, 2000); 
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="bg-white dark:bg-slate-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl leading-6 font-bold text-gray-900 dark:text-white" id="modal-title">
                Get Your Free Audit
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill out the form below and our team will get back to you within 24 hours with a custom growth strategy.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Email</label>
                  <input 
                    type="email" 
                    required 
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website URL (Optional)</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="help" className="block text-sm font-medium text-gray-700 dark:text-gray-300">How can we help?</label>
                  <select 
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                    value={formData.help}
                    onChange={(e) => setFormData({...formData, help: e.target.value})}
                  >
                    <option>I need a new website</option>
                    <option>I want to rank higher on Google (SEO)</option>
                    <option>I need social media marketing</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-[#8B24C5] text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Sending...' : 'Request Free Audit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;