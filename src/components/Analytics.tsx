import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface AnalyticsData {
  totalRevenue: number;
  totalLeads: number;
  wonDeals: number;
  winRate: number;
  statusDistribution: { _id: string; count: number }[];
  revenueBySource: { _id: string; value: number }[];
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. GET LOGGED-IN USER
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "role": "Guest"}');
  const getInitials = (name: string) => name ? name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() : '??';

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // 2. FETCH WITH TOKEN
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytics', {
            headers: {
                'Authorization': localStorage.getItem('token') || ''
            }
        });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) handleLogout();
            throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const getStatusCount = (status: string) => {
    if (!data) return 0;
    const found = data.statusDistribution.find(s => s._id === status);
    return found ? found.count : 0;
  };

  const getBarWidth = (val: number, total: number) => {
    if (!total || total === 0) return '0%';
    return `${(val / total) * 100}%`;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 3. SECURE CSV DOWNLOAD
  const handleDownloadCSV = () => {
    if (!data) return;

    // Client-side CSV generation (Since we already have the data)
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    
    csvContent += `Total Revenue,${data.totalRevenue}\n`;
    csvContent += `Total Leads,${data.totalLeads}\n`;
    csvContent += `Won Deals,${data.wonDeals}\n`;
    csvContent += `Win Rate,${data.winRate}%\n\n`;

    csvContent += "Source,Revenue Generated\n";
    data.revenueBySource.forEach(item => {
        csvContent += `${item._id || 'Unknown'},${item.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "growth_service_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans antialiased min-h-screen transition-colors duration-200">
      
      {/* Navigation */}
      <nav className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="mr-2 p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                <span className="material-icons-outlined">arrow_back</span>
              </button>
              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B24C5] to-[#D946EF] flex items-center justify-center text-white font-bold text-sm">GS</div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Growth Service</span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/pipeline" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Pipeline</Link>
                <Link to="/contacts" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Contacts</Link>
                <a href="#" className="border-[#8B24C5] text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Reports</a>
              </div>
            </div>
            
            {/* DYNAMIC HEADER PROFILE */}
            <div className="flex items-center gap-4">
              <div className="relative ml-3">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-3 focus:outline-none p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                      {getInitials(user.name)}
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-md shadow-lg py-1 border border-border-light dark:border-border-dark z-50">
                      <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:text-3xl sm:truncate">Analytics & Reports</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Real-time insights from your CRM data.</p>
            </div>
            <button onClick={handleDownloadCSV} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B24C5] hover:bg-purple-700 transition-colors">
                <span className="material-icons-outlined text-sm mr-2">download</span> Export Data
            </button>
          </div>

          {loading ? (
             <div className="text-center py-20 text-slate-500">Loading analytics...</div>
          ) : !data ? (
             <div className="text-center py-20 text-slate-500">Failed to load data.</div>
          ) : (
            <>
              {/* KPI Cards (Same as before) */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark overflow-hidden shadow rounded-lg border border-border-light dark:border-border-dark p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-md p-3">
                      <span className="material-icons-outlined text-[#8B24C5] text-xl">currency_rupee</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Revenue</dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">₹{data.totalRevenue.toLocaleString('en-IN')}</dd>
                    </div>
                  </div>
                </div>
                {/* ... (Other cards remain same) ... */}
                <div className="bg-surface-light dark:bg-surface-dark overflow-hidden shadow rounded-lg border border-border-light dark:border-border-dark p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-md p-3">
                      <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-xl">group</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Leads</dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalLeads}</dd>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark overflow-hidden shadow rounded-lg border border-border-light dark:border-border-dark p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                      <span className="material-icons-outlined text-green-600 dark:text-green-400 text-xl">check_circle</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Won Deals</dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">{data.wonDeals}</dd>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark overflow-hidden shadow rounded-lg border border-border-light dark:border-border-dark p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-md p-3">
                      <span className="material-icons-outlined text-purple-600 dark:text-purple-400 text-xl">trending_up</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Win Rate</dt>
                      <dd className="text-2xl font-bold text-slate-900 dark:text-white">{data.winRate}%</dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Lead Status Distribution */}
                <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg border border-border-light dark:border-border-dark p-6">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white mb-4">Lead Status Distribution</h3>
                  <div className="space-y-4">
                    {['New', 'Contacted', 'Negotiation', 'Won'].map((status) => {
                        const count = getStatusCount(status);
                        const width = getBarWidth(count, data.totalLeads);
                        const color = status === 'Won' ? 'bg-green-500' : status === 'Negotiation' ? 'bg-purple-500' : status === 'Contacted' ? 'bg-yellow-500' : 'bg-blue-500';
                        
                        return (
                            <div key={status}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{status}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{count} Leads</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: width }}></div>
                                </div>
                            </div>
                        );
                    })}
                  </div>
                </div>

                {/* Revenue by Source */}
                <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg border border-border-light dark:border-border-dark p-6">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white mb-4">Revenue by Source</h3>
                  
                  {(!data.revenueBySource || data.revenueBySource.length === 0) ? (
                      <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                          <p>No revenue data available yet. Add values to your leads!</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                        {data.revenueBySource.map((sourceItem) => {
                            const width = getBarWidth(sourceItem.value, data.totalRevenue);
                            return (
                                <div key={sourceItem._id}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{sourceItem._id || 'Unknown Source'}</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">₹{sourceItem.value.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: width }}></div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                            <button 
                                onClick={handleDownloadCSV}
                                className="text-[#8B24C5] font-medium hover:text-purple-700 text-sm inline-flex items-center"
                            >
                                <span className="material-icons-outlined text-sm mr-1">download</span> Download Detailed CSV Report
                            </button>
                        </div>
                      </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Analytics;