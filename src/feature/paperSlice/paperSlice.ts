import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PaperResponse, PaperRequest, GetPapersResponse, PaginationParams } from '@/types/paperType';
import { RootState } from '@/lib/store';
import apiService from '@/services/api';

interface PaperState {
  papers: PaperResponse[];
  publishedPapers: GetPapersResponse | null;
  authorPapers: GetPapersResponse | null;
  selectedPaper: { paper: PaperResponse; message: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaperState = {
  papers: [],
  publishedPapers: null,
  authorPapers: null,
  selectedPaper: null,
  loading: false,
  error: null,
};

// Async thunks for paper operations
export const createPaper = createAsyncThunk(
  'paper/create',
  async (paperData: PaperRequest, { rejectWithValue }) => {
    try {
      return await apiService.papers.createPaper(paperData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create paper');
    }
  }
);

export const fetchPublishedPapers = createAsyncThunk(
  'paper/fetchPublished',
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      return await apiService.papers.getPublishedPapers(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch published papers');
    }
  }
);

export const fetchPaperByUuid = createAsyncThunk(
  'paper/fetchByUuid',
  async (uuid: string, { rejectWithValue }) => {
    try {
      return await apiService.papers.getPaperByUuid(uuid);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch paper');
    }
  }
);

export const fetchAuthorPapers = createAsyncThunk(
  'paper/fetchAuthor',
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      return await apiService.papers.getAuthorPapers(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch author papers');
    }
  }
);

export const fetchAuthorApprovedPapers = createAsyncThunk(
  'paper/fetchAuthorApproved',
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      return await apiService.papers.getAuthorApprovedPapers(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch approved papers');
    }
  }
);

export const updatePaper = createAsyncThunk(
  'paper/update',
  async ({ uuid, paperData }: { uuid: string; paperData: PaperRequest }, { rejectWithValue }) => {
    try {
      return await apiService.papers.updatePaperByAuthor(uuid, paperData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update paper');
    }
  }
);

export const deletePaper = createAsyncThunk(
  'paper/delete',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await apiService.papers.deletePaperByAuthor(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete paper');
    }
  }
);

const paperSlice = createSlice({
  name: 'paper',
  initialState,
  reducers: {
    setSelectedPaper: (state, action: PayloadAction<{ paper: PaperResponse; message: string } | null>) => {
      state.selectedPaper = action.payload;
    },
    clearPaperError: (state) => {
      state.error = null;
    },
    clearPapers: (state) => {
      state.papers = [];
      state.publishedPapers = null;
      state.authorPapers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create paper
      .addCase(createPaper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaper.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch published papers
      .addCase(fetchPublishedPapers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedPapers.fulfilled, (state, action) => {
        state.loading = false;
        state.publishedPapers = action.payload;
        state.papers = action.payload.papers.content;
        state.error = null;
      })
      .addCase(fetchPublishedPapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch paper by UUID
      .addCase(fetchPaperByUuid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaperByUuid.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPaper = action.payload;
        state.error = null;
      })
      .addCase(fetchPaperByUuid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch author papers
      .addCase(fetchAuthorPapers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorPapers.fulfilled, (state, action) => {
        state.loading = false;
        state.authorPapers = action.payload;
        state.error = null;
      })
      .addCase(fetchAuthorPapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch author approved papers
      .addCase(fetchAuthorApprovedPapers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorApprovedPapers.fulfilled, (state, action) => {
        state.loading = false;
        state.authorPapers = action.payload;
        state.error = null;
      })
      .addCase(fetchAuthorApprovedPapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update paper
      .addCase(updatePaper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaper.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.papers.findIndex(paper => paper.uuid === action.payload.paper.uuid);
        if (index !== -1) {
          state.papers[index] = action.payload.paper;
        }
        if (state.selectedPaper?.paper.uuid === action.payload.paper.uuid) {
          state.selectedPaper = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete paper
      .addCase(deletePaper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaper.fulfilled, (state, action) => {
        state.loading = false;
        state.papers = state.papers.filter(paper => paper.uuid !== action.payload);
        if (state.selectedPaper?.paper.uuid === action.payload) {
          state.selectedPaper = null;
        }
        state.error = null;
      })
      .addCase(deletePaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedPaper, clearPaperError, clearPapers } = paperSlice.actions;

// Selectors
export const selectPapers = (state: RootState) => state.paper.papers;
export const selectPublishedPapers = (state: RootState) => state.paper.publishedPapers;
export const selectAuthorPapers = (state: RootState) => state.paper.authorPapers;
export const selectSelectedPaper = (state: RootState) => state.paper.selectedPaper;
export const selectPaperLoading = (state: RootState) => state.paper.loading;
export const selectPaperError = (state: RootState) => state.paper.error;

export default paperSlice.reducer;
