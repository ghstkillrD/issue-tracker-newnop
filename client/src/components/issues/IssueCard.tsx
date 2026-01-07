import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import type { Issue } from '../../services/issueService';

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div
      onClick={() => navigate(`/issue/${issue._id}`)}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors">
          {issue.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge type="status" value={issue.status} />
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {issue.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge type="priority" value={issue.priority} />
        <Badge type="severity" value={issue.severity} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
        <span>Created by: {issue.createdBy?.name || issue.createdBy?.email}</span>
        <span>{formatDate(issue.createdAt)}</span>
      </div>
    </div>
  );
};

export default IssueCard;
