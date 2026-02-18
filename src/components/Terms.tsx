import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-8">
        {/* Fixed: Changed from button/useNavigate to a direct Link */}
        <Link to="/dashboard" className="mb-4 text-slate-500 hover:text-[#8B24C5] inline-flex items-center gap-1 transition-colors">
            <span className="material-icons-outlined text-sm">arrow_back</span> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300">
            <p className="mb-4">Last updated: February 2026</p>
            <p className="mb-4">Please read these Terms of Service carefully before using the GrowthService platform.</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">1. Acceptance of Terms</h3>
            <p className="mb-4">By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">2. Accounts</h3>
            <p className="mb-4">When you create an account with us, you must provide us information that is accurate, complete, and current at all times.</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">3. Termination</h3>
            <p className="mb-4">We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;