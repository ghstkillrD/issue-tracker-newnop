import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import type { Issue } from '../../services/issueService';

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/issue/${issue._id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-slate-200 hover:border-purple-300 p-6 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2">
          {issue.title}
        </h3>
        <Badge type="status" value={issue.status} />
      </div>

      {/* Description */}
      <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
        {issue.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge type="priority" value={issue.priority} />
        <Badge type="severity" value={issue.severity} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-medium">{issue.createdBy?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(issue.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
