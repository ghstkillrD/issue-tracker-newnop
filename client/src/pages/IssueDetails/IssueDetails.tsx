import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchIssueById, updateIssue as updateIssueAction, deleteIssue as deleteIssueAction, clearCurrentIssue } from '../../store/slices/issuesSlice';
import { logout } from '../../store/slices/authSlice';
import type { UpdateIssueData } from '../../services/issueService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import IssueForm from '../../components/issues/IssueForm';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentIssue: issue, loading } = useAppSelector((state) => state.issues);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      dispatch(fetchIssueById(id)).unwrap().catch((error) => {
        toast.error(error || 'Failed to load issue details');
        navigate('/dashboard');
      });
    }

    return () => {
      dispatch(clearCurrentIssue());
    };
  }, [id, isAuthenticated, navigate, dispatch]);

  const handleUpdateIssue = async (data: UpdateIssueData) => {
    if (!id) return;

    try {
      await dispatch(updateIssueAction({ id, data })).unwrap();
      setIsEditModalOpen(false);
      toast.success('Issue updated successfully!');
    } catch (error: any) {
      toast.error(error || 'Failed to update issue');
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
        await dispatch(updateIssueAction({ id, data: { status: 'Resolved' } })).unwrap();
        toast.success('Issue marked as resolved!');
      } catch (error: any) {
        toast.error(error || 'Failed to update issue status');
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
        await dispatch(deleteIssueAction(id)).unwrap();
        toast.success('Issue deleted successfully');
        navigate('/dashboard');
      } catch (error: any) {
        toast.error(error || 'Failed to delete issue');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-100 to-cyan-100 flex items-center justify-center">
        <p className="text-slate-700 text-lg">Issue not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-100 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-300 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <Navbar onLogout={handleLogout} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-violet-700 hover:text-violet-900 font-semibold flex items-center gap-2 group transition-colors"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Action Buttons - Separated from card */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-3 bg-white/90 backdrop-blur-sm text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all font-bold"
          >
            Edit
          </button>
          {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
            <button
              onClick={handleMarkAsResolved}
              className="px-6 py-3 bg-white/90 backdrop-blur-sm text-green-600 border-2 border-green-600 rounded-xl hover:bg-green-50 hover:shadow-lg transition-all font-bold"
            >
              Mark as Resolved
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-white/90 backdrop-blur-sm text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 hover:shadow-lg transition-all font-bold"
          >
            Delete
          </button>
        </div>

        {/* Issue Details Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {issue.title}
            </h2>
            
            {/* Badges with Labels */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Status:</span>
                <Badge type="status" value={issue.status} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Priority:</span>
                <Badge type="priority" value={issue.priority} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Severity:</span>
                <Badge type="severity" value={issue.severity} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{issue.description}</p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Issue Details</h3>
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

      <Footer />

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
