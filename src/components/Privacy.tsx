import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-8">
        {/* Fixed: Changed from button/useNavigate to a direct Link */}
        <Link to="/dashboard" className="mb-4 text-slate-500 hover:text-[#8B24C5] inline-flex items-center gap-1 transition-colors">
            <span className="material-icons-outlined text-sm">arrow_back</span> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300">
            <p className="mb-4">Last updated: February 2026</p>
            <p className="mb-4">At GrowthService, we take your privacy seriously. This policy describes how we collect, use, and protect your personal data.</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">1. Information We Collect</h3>
            <p className="mb-4">We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">2. How We Use Your Information</h3>
            <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">3. Data Security</h3>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect the security of your personal data.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;