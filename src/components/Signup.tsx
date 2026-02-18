import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-xl shadow-lg">
            GS
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#8B24C5] hover:text-purple-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    First Name
                </label>
                <div className="mt-1">
                    <input id="firstName" name="firstName" type="text" required className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#8B24C5] focus:border-[#8B24C5] sm:text-sm dark:bg-slate-700 dark:text-white" />
                </div>
                </div>
                <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Name
                </label>
                <div className="mt-1">
                    <input id="lastName" name="lastName" type="text" required className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#8B24C5] focus:border-[#8B24C5] sm:text-sm dark:bg-slate-700 dark:text-white" />
                </div>
                </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#8B24C5] focus:border-[#8B24C5] sm:text-sm dark:bg-slate-700 dark:text-white" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#8B24C5] focus:border-[#8B24C5] sm:text-sm dark:bg-slate-700 dark:text-white" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B24C5] transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
        <div className="text-center mt-4">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1">
                <span className="material-icons-outlined text-sm">arrow_back</span> Back to Website
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;