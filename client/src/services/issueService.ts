import api from './api';

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  severity: 'Critical' | 'Major' | 'Minor';
  createdBy: {
    _id: string;
    email: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IssueStats {
  total: number;
  byStatus: {
    Open: number;
    'In Progress': number;
    Resolved: number;
    Closed: number;
  };
  byPriority: {
    Low: number;
    Medium: number;
    High: number;
  };
  bySeverity: {
    Critical: number;
    Major: number;
    Minor: number;
  };
}

export interface IssuesResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Issue[];
}

export interface CreateIssueData {
  title: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High';
  severity?: 'Critical' | 'Major' | 'Minor';
}

export interface UpdateIssueData {
  title?: string;
  description?: string;
  status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority?: 'Low' | 'Medium' | 'High';
  severity?: 'Critical' | 'Major' | 'Minor';
}

export const issueService = {
  // Get all issues with filters
  getIssues: async (params?: {
    status?: string;
    priority?: string;
    severity?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<IssuesResponse> => {
    const response = await api.get('/issues', { params });
    return response.data;
  },

  // Get issue stats
  getStats: async (): Promise<IssueStats> => {
    const response = await api.get('/issues/stats');
    return response.data.data;
  },

  // Get single issue by ID
  getIssueById: async (id: string): Promise<Issue> => {
    const response = await api.get(`/issues/${id}`);
    return response.data.data;
  },

  // Create new issue
  createIssue: async (data: CreateIssueData): Promise<Issue> => {
    const response = await api.post('/issues', data);
    return response.data.data;
  },

  // Update issue
  updateIssue: async (id: string, data: UpdateIssueData): Promise<Issue> => {
    const response = await api.put(`/issues/${id}`, data);
    return response.data.data;
  },

  // Delete issue
  deleteIssue: async (id: string): Promise<void> => {
    await api.delete(`/issues/${id}`);
  },
};

export default issueService;
