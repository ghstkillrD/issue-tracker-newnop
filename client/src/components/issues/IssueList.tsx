import IssueCard from './IssueCard';
import type { Issue } from '../../services/issueService';

interface IssueListProps {
  issues: Issue[];
  loading?: boolean;
}

const IssueList = ({ issues, loading }: IssueListProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-t-4 border-blue-200 animate-pulse"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-6 shadow-inner">
            <svg
              className="h-10 w-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No issues found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Get started by creating a new issue or adjust your filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <IssueCard key={issue._id} issue={issue} />
      ))}
    </div>
  );
};

export default IssueList;
