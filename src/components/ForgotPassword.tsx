import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Sending reset link...");

    try {
      await api.post('/auth/forgot-password', { email });
      toast.success("Email sent! Check your inbox.", { id: loadingToast });
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong", { id: loadingToast });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-xl shadow-lg">GS</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Forgot your password?</h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#8B24C5] focus:border-[#8B24C5] sm:text-sm dark:bg-slate-700 dark:text-white" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B24C5] disabled:opacity-50 transition-colors">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
          <div className="mt-6">
             <Link to="/login" className="w-full flex justify-center text-sm font-medium text-[#8B24C5] hover:text-purple-500">
                Back to Sign In
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;