import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import issueService, { type Issue, type UpdateIssueData } from '../../services/issueService';
import authService from '../../services/authService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import IssueForm from '../../components/issues/IssueForm';

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchIssue();
    }
  }, [id]);

  const fetchIssue = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await issueService.getIssueById(id);
      setIssue(data);
    } catch (error: any) {
      console.error('Error fetching issue:', error);
      if (error.response?.status === 401) {
        authService.logout();
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Issue not found');
        navigate('/dashboard');
      } else {
        toast.error('Failed to load issue details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIssue = async (data: UpdateIssueData) => {
    if (!id) return;

    try {
      await issueService.updateIssue(id, data);
      setIsEditModalOpen(false);
      toast.success('Issue updated successfully!');
      fetchIssue(); // Refresh issue data
    } catch (error: any) {
      console.error('Error updating issue:', error);
      toast.error(error.response?.data?.message || 'Failed to update issue');
      throw error;
    }
  };

  const handleMarkAsResolved = async () => {
    if (!id || !issue) return;

    const confirmed = window.confirm(
      'Are you sure you want to mark this issue as Resolved?'
    );

    if (confirmed) {
      try {
        await issueService.updateIssue(id, { status: 'Resolved' });
        toast.success('Issue marked as resolved!');
        fetchIssue(); // Refresh issue data
      } catch (error: any) {
        console.error('Error updating issue status:', error);
        toast.error(error.response?.data?.message || 'Failed to update issue status');
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this issue? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        await issueService.deleteIssue(id);
        toast.success('Issue deleted successfully');
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Error deleting issue:', error);
        toast.error(error.response?.data?.message || 'Failed to delete issue');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-100 to-cyan-100 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-violet-600 border-r-purple-600 border-b-pink-600"></div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Issue not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-2 flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {issue.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                >
                  Edit
                </button>
                {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
                  <button
                    onClick={handleMarkAsResolved}
                    className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors font-medium"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge type="status" value={issue.status} />
              <Badge type="priority" value={issue.priority} />
              <Badge type="severity" value={issue.severity} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{issue.description}</p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Issue Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-slate-700">Created By:</span>
                <span className="ml-2 text-slate-600">
                  {issue.createdBy?.name || issue.createdBy?.email}
                </span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Created At:</span>
                <span className="ml-2 text-slate-600">{formatDate(issue.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Last Updated:</span>
                <span className="ml-2 text-slate-600">{formatDate(issue.updatedAt)}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Issue ID:</span>
                <span className="ml-2 text-slate-600 font-mono text-xs">{issue._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Issue Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Issue"
      >
        <IssueForm
          issue={issue}
          onSubmit={handleUpdateIssue}
          onCancel={() => setIsEditModalOpen(false)}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default IssueDetails;
