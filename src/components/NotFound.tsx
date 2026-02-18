import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center text-center transition-colors duration-200">
      <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="material-icons-outlined text-[#8B24C5] text-5xl">sentiment_dissatisfied</span>
      </div>
      <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-700 dark:text-slate-200">Page not found</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm">
        Sorry, we couldn't find the page you're looking for. It might have been removed or the URL is incorrect.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/" className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Go Home
        </Link>
        <Link to="/dashboard" className="px-6 py-3 bg-[#8B24C5] rounded-lg text-white font-medium hover:bg-purple-700 transition-colors shadow-lg">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;