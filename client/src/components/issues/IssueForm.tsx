import { useState, useEffect } from 'react';
import type { Issue, CreateIssueData, UpdateIssueData } from '../../services/issueService';

interface IssueFormProps {
  issue?: Issue | null;
  onSubmit: (data: CreateIssueData | UpdateIssueData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const IssueForm = ({ issue, onSubmit, onCancel, isEdit = false }: IssueFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    severity: 'Minor' as 'Critical' | 'Major' | 'Minor',
    status: 'Open' as 'Open' | 'In Progress' | 'Resolved' | 'Closed',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        severity: issue.severity,
        status: issue.status,
      });
    }
  }, [issue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await onSubmit({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          severity: formData.severity,
          status: formData.status,
        });
      } else {
        await onSubmit({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          severity: formData.severity,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-slate-700 mb-1">
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {isEdit && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Issue' : 'Create Issue'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-white text-slate-700 py-2 px-4 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default IssueForm;
