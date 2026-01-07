import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import issueService, { type Issue, type IssueStats, type CreateIssueData, type UpdateIssueData } from '../../services/issueService';
import authService from '../../services/authService';
import IssueList from '../../components/issues/IssueList.tsx';
import Modal from '../../components/common/Modal';
import IssueForm from '../../components/issues/IssueForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<IssueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [searchTerm, statusFilter, priorityFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch issues with filters
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const [issuesResponse, statsData] = await Promise.all([
        issueService.getIssues(params),
        issueService.getStats(),
      ]);

      setIssues(issuesResponse.data);
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        authService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleCreateIssue = async (data: CreateIssueData | UpdateIssueData) => {
    try {
      await issueService.createIssue(data as CreateIssueData);
      setIsModalOpen(false);
      fetchData(); // Refresh the issue list
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">{/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Issue Tracker</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Open Issues</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.byStatus?.Open || 0}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-600 mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats?.byStatus?.['In Progress'] || 0}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats?.byStatus?.Resolved || 0}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Issues</h3>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.total || 0}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search issues by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                + New Issue
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              {(searchTerm || statusFilter || priorityFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setPriorityFilter('');
                  }}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Issue List */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Issues
            {(statusFilter || priorityFilter || searchTerm) && (
              <span className="text-sm font-normal text-slate-600 ml-2">
                ({issues.length} {issues.length === 1 ? 'result' : 'results'})
              </span>
            )}
          </h2>
          <IssueList issues={issues} loading={loading} />
        </div>
      </div>

      {/* Create Issue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Issue"
      >
        <IssueForm
          onSubmit={handleCreateIssue}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
