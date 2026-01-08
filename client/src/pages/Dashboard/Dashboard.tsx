import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchIssues, fetchStats, createIssue as createIssueAction, setFilters, setPage, setLimit } from '../../store/slices/issuesSlice';
import { logout } from '../../store/slices/authSlice';
import type { CreateIssueData, UpdateIssueData } from '../../services/issueService';
import IssueList from '../../components/issues/IssueList.tsx';
import Modal from '../../components/common/Modal';
import IssueForm from '../../components/issues/IssueForm';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { issues, stats, loading, pagination } = useAppSelector((state) => state.issues);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Fetch stats on mount
    dispatch(fetchStats());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    // Fetch issues when filters change
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    params.page = pagination.currentPage;
    params.limit = pagination.limit;

    dispatch(setFilters({ search: searchTerm, status: statusFilter, priority: priorityFilter }));
    dispatch(fetchIssues(params)).catch(() => {
      toast.error('Failed to load dashboard data. Please refresh the page.');
    });
  }, [searchTerm, statusFilter, priorityFilter, pagination.currentPage, pagination.limit, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateIssue = async (data: CreateIssueData | UpdateIssueData) => {
    try {
      await dispatch(createIssueAction(data as CreateIssueData)).unwrap();
      setIsModalOpen(false);
      toast.success('Issue created successfully!');
      
      // Refresh stats and issues
      dispatch(fetchStats());
      dispatch(fetchIssues({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        page: pagination.currentPage,
        limit: pagination.limit,
      }));
    } catch (error: any) {
      toast.error(error || 'Failed to create issue. Please try again.');
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handleExportCSV = () => {
    if (issues.length === 0) {
      toast.error('No issues to export');
      return;
    }

    // Define CSV headers
    const headers = ['Title', 'Status', 'Priority', 'Severity', 'Created By', 'Created At', 'Last Updated'];
    
    // Convert issues to CSV rows
    const rows = issues.map(issue => [
      `"${issue.title.replace(/"/g, '""')}"`, // Escape quotes in title
      issue.status,
      issue.priority,
      issue.severity,
      issue.createdBy?.name || issue.createdBy?.email || 'Unknown',
      new Date(issue.createdAt).toLocaleString(),
      new Date(issue.updatedAt).toLocaleString()
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `issues_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${issues.length} issues to CSV`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-100 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-300 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <Navbar onLogout={handleLogout} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">Open Issues</p>
                  <p className="text-white text-4xl font-extrabold">{stats.byStatus.Open}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-semibold mb-1">In Progress</p>
                  <p className="text-white text-4xl font-extrabold">{stats.byStatus['In Progress']}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-semibold mb-1">Resolved</p>
                  <p className="text-white text-4xl font-extrabold">{stats.byStatus.Resolved}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-semibold mb-1">Total Issues</p>
                  <p className="text-white text-4xl font-extrabold">{stats.total}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 border border-white/40">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-5 py-4 pr-10 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-700 font-medium cursor-pointer hover:border-purple-300 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none px-5 py-4 pr-10 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-700 font-medium cursor-pointer hover:border-purple-300 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
              >
                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Issue
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/40">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
            All Issues
          </h2>
          <IssueList issues={issues} loading={loading} />

          {/* Pagination Controls */}
          {!loading && issues.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              {/* Items per page selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 font-medium">Items per page:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-700 font-medium cursor-pointer hover:border-purple-300"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-slate-500">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total}
                </span>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white transition-all font-medium text-slate-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          pagination.currentPage === pageNum
                            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white transition-all font-medium text-slate-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Issue Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Issue">
        <IssueForm onSubmit={handleCreateIssue} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      {/* Floating Export CSV Button */}
      <button
        onClick={handleExportCSV}
        disabled={loading || issues.length === 0}
        className="group fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-40 flex items-center overflow-hidden opacity-90 hover:opacity-100"
        title="Export issues to CSV"
      >
        <div className="p-4 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pr-0 group-hover:pr-5 font-bold">
          Export CSV
        </span>
      </button>

      <Footer />
    </div>
  );
};

export default Dashboard;
