import IssueCard from './IssueCard';
import type { Issue } from '../../services/issueService';

interface IssueListProps {
  issues: Issue[];
  loading?: boolean;
}

const IssueList = ({ issues, loading }: IssueListProps) => {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-violet-600 border-r-purple-600 border-b-pink-600"></div>
          </div>
          <p className="mt-6 text-slate-700 font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Loading issues...
          </p>
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <svg
              className="h-12 w-12 text-white"
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
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
            No issues found
          </h3>
          <p className="text-slate-600 text-lg max-w-md mx-auto">
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
