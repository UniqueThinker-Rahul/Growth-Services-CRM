import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import api from '../utils/api';
import toast from 'react-hot-toast';

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('admin@growth.io');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${response.data.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setError('Invalid Credentials');
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-2xl">G</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Or start your 14-day free trial</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8B24C5] focus:border-[#8B24C5] sm:text-sm bg-slate-50" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8B24C5] focus:border-[#8B24C5] sm:text-sm" />
              </div>
            </div>

            {/* --- NEW SECTION: FORGOT PASSWORD LINK --- */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-[#8B24C5] hover:text-purple-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B24C5] disabled:opacity-50 transition-colors">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
             {/* <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Demo Credentials</span></div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Demo Credentials</span></div>
            </div>
             <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-center text-gray-400">
              <p>Admin</p>
              <p>User</p> 
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;