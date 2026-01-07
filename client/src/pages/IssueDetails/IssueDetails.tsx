import { useParams } from 'react-router-dom';

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-900">Issue #{id}</h1>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Open
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Medium Priority
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Major
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Description</h2>
            <p className="text-slate-600">Loading issue details...</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-700">Created By:</span>
              <span className="ml-2 text-slate-600">-</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Created At:</span>
              <span className="ml-2 text-slate-600">-</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Updated At:</span>
              <span className="ml-2 text-slate-600">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
