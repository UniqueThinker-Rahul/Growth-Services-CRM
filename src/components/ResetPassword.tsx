import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading("Updating password...");

    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      toast.success("Password updated! Please login.", { id: loadingToast });
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired token", { id: loadingToast });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Set New Password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;