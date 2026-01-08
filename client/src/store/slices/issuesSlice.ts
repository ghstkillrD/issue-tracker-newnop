import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import issueService from '../../services/issueService';
import type { Issue, IssueStats, CreateIssueData, UpdateIssueData } from '../../services/issueService';

interface IssuesState {
  issues: Issue[];
  currentIssue: Issue | null;
  stats: IssueStats | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    priority: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

const initialState: IssuesState = {
  issues: [],
  currentIssue: null,
  stats: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    priority: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
};

// Async thunks
export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (params: { search?: string; status?: string; priority?: string; page?: number; limit?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await issueService.getIssues(params || {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues');
    }
  }
);

export const fetchIssueById = createAsyncThunk(
  'issues/fetchIssueById',
  async (id: string, { rejectWithValue }) => {
    try {
      const issue = await issueService.getIssueById(id);
      return issue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'issues/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await issueService.getStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (data: CreateIssueData, { rejectWithValue }) => {
    try {
      const issue = await issueService.createIssue(data);
      return issue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create issue');
    }
  }
);

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ id, data }: { id: string; data: UpdateIssueData }, { rejectWithValue }) => {
    try {
      const issue = await issueService.updateIssue(id, data);
      return issue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update issue');
    }
  }
);

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (id: string, { rejectWithValue }) => {
    try {
      await issueService.deleteIssue(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete issue');
    }
  }
);

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ search?: string; status?: string; priority?: string }>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', status: '', priority: '' };
    },
    clearCurrentIssue: (state) => {
      state.currentIssue = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing limit
    },
  },
  extraReducers: (builder) => {
    // Fetch Issues
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload.data;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: state.pagination.limit,
        };
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Issue By ID
    builder
      .addCase(fetchIssueById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueById.fulfilled, (state, action: PayloadAction<Issue>) => {
        state.loading = false;
        state.currentIssue = action.payload;
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Stats
    builder
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<IssueStats>) => {
        state.stats = action.payload;
      });

    // Create Issue
    builder
      .addCase(createIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action: PayloadAction<Issue>) => {
        state.loading = false;
        state.issues.unshift(action.payload);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Issue
    builder
      .addCase(updateIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action: PayloadAction<Issue>) => {
        state.loading = false;
        const index = state.issues.findIndex((issue) => issue._id === action.payload._id);
        if (index !== -1) {
          state.issues[index] = action.payload;
        }
        if (state.currentIssue?._id === action.payload._id) {
          state.currentIssue = action.payload;
        }
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Issue
    builder
      .addCase(deleteIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssue.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.issues = state.issues.filter((issue) => issue._id !== action.payload);
        if (state.currentIssue?._id === action.payload) {
          state.currentIssue = null;
        }
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentIssue, clearError, setPage, setLimit } = issuesSlice.actions;
export default issuesSlice.reducer;
