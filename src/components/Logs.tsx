import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Skeleton from './Skeleton';

interface Log {
  _id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/logs');
        if (Array.isArray(response.data)) setLogs(response.data);
      } catch (err) {
        toast.error("Failed to load logs. Are you an Admin?");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const downloadCSV = async () => {
    try {
        const response = await api.get('/logs/download', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'activity_logs.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Logs downloaded successfully!");
    } catch (error) {
        toast.error("Failed to download logs.");
    }
  };

  // Helper to generate initials for the avatar
  const getInitials = (name: string) => {
    if (!name) return 'U';
    // Clean up strings like "User-6990d1c..." to just "US"
    const cleanName = name.replace('User-', 'User ').replace(/[^a-zA-Z ]/g, '');
    return cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  };

  // Helper to colorize action badges dynamically
  const getActionBadge = (action: string) => {
    const baseStyle = "px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border";
    const actionUpper = action.toUpperCase();

    if (actionUpper.includes('CREATE') || actionUpper.includes('INVITE')) {
        return `${baseStyle} bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800`;
    }
    if (actionUpper.includes('UPDATE') || actionUpper.includes('EDIT')) {
        return `${baseStyle} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800`;
    }
    if (actionUpper.includes('DELETE') || actionUpper.includes('REMOVE')) {
        return `${baseStyle} bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800`;
    }
    
    return `${baseStyle} bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`;
  };

  // Helper to format date nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
        day: '2-digit', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  return (
    <div className="p-6 md:p-10 bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to="/dashboard" className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#8B24C5] hover:border-purple-200 transition-all flex items-center justify-center shadow-sm">
                <span className="material-icons-outlined text-sm">arrow_back</span>
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Activity Logs</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 ml-12">Monitor all system events, data changes, and user actions securely.</p>
          </div>
          
          <button onClick={downloadCSV} className="flex items-center justify-center gap-2 bg-[#8B24C5] hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md shadow-purple-200 dark:shadow-none transition-all">
            <span className="material-icons-outlined text-[18px]">download</span>
            Export to CSV
          </button>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            {loading ? (
                <div className="p-6 space-y-4">
                    <Skeleton className="h-12 rounded-lg" count={8} />
                </div>
            ) : logs.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
                        <span className="material-icons-outlined text-slate-400 dark:text-slate-300 text-4xl">history</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No activity found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">System logs will appear here once actions are performed.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action Event</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                    {/* Date */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(log.timestamp)}
                                    </td>
                                    
                                    {/* User */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-xs text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                                {getInitials(log.user)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[150px]" title={log.user}>
                                                    {log.user.split('-')[0]} 
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{log.role}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Action */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getActionBadge(log.action)}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>

                                    {/* Details */}
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-md truncate" title={log.details}>
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
