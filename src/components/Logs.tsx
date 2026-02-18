import React, { useEffect, useState } from 'react';
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
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load logs. Are you an Admin?");
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
    } catch (error) {
        toast.error("Failed to download logs.");
    }
  };

  return (
    <div className="p-10 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">System Activity Logs</h1>
            <button onClick={downloadCSV} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Download CSV</button>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
            {loading ? (
                <div className="p-6 space-y-4"><Skeleton className="h-12" count={10} /></div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {logs.map(log => (
                            <tr key={log._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{log.user} <span className="text-xs text-gray-400">({log.role})</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"><span className="px-2 py-1 bg-gray-100 dark:bg-slate-600 rounded text-xs font-mono">{log.action}</span></td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default Logs;