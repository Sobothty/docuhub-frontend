import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AdviserDetailResponse, AdviserDetailRequest, UpdateAdviserDetailRequest, PaginatedAssignmentsResponse } from '@/types/adviserType';
import { RootState } from '@/lib/store';
import apiService from '@/services/api';

interface AdviserDetailState {
  adviserDetails: AdviserDetailResponse[];
  selectedAdviser: AdviserDetailResponse | null;
  assignments: PaginatedAssignmentsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdviserDetailState = {
  adviserDetails: [],
  selectedAdviser: null,
  assignments: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchAllAdvisers = createAsyncThunk(
  'adviserDetail/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.advisers.getAllAdviserDetails();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch advisers');
    }
  }
);

export const fetchAdviserByUuid = createAsyncThunk(
  'adviserDetail/fetchByUuid',
  async (uuid: string, { rejectWithValue }) => {
    try {
      return await apiService.advisers.getAdviserDetailByUuid(uuid);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch adviser');
    }
  }
);

export const createAdviser = createAsyncThunk(
  'adviserDetail/create',
  async (adviserData: AdviserDetailRequest, { rejectWithValue }) => {
    try {
      return await apiService.advisers.createAdviserDetail(adviserData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create adviser');
    }
  }
);

export const updateAdviser = createAsyncThunk(
  'adviserDetail/update',
  async ({ uuid, data }: { uuid: string; data: UpdateAdviserDetailRequest }, { rejectWithValue }) => {
    try {
      return await apiService.advisers.updateAdviserDetailByUuid(uuid, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update adviser');
    }
  }
);

export const updateAdviserByToken = createAsyncThunk(
  'adviserDetail/updateByToken',
  async (data: UpdateAdviserDetailRequest, { rejectWithValue }) => {
    try {
      return await apiService.advisers.updateAdviserDetailByToken(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update adviser');
    }
  }
);

export const deleteAdviser = createAsyncThunk(
  'adviserDetail/delete',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await apiService.advisers.deleteAdviserDetail(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete adviser');
    }
  }
);

export const fetchAdviserAssignments = createAsyncThunk(
  'adviserDetail/fetchAssignments',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.advisers.getAllAssignments(page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch assignments');
    }
  }
);

const adviserDetailSlice = createSlice({
  name: 'adviserDetail',
  initialState,
  reducers: {
    setSelectedAdviser: (state, action: PayloadAction<AdviserDetailResponse | null>) => {
      state.selectedAdviser = action.payload;
    },
    clearAdviserError: (state) => {
      state.error = null;
    },
    clearAssignments: (state) => {
      state.assignments = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all advisers
      .addCase(fetchAllAdvisers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdvisers.fulfilled, (state, action) => {
        state.loading = false;
        state.adviserDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchAllAdvisers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch adviser by UUID
      .addCase(fetchAdviserByUuid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdviserByUuid.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdviser = action.payload;
        state.error = null;
      })
      .addCase(fetchAdviserByUuid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create adviser
      .addCase(createAdviser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdviser.fulfilled, (state, action) => {
        state.loading = false;
        state.adviserDetails.push(action.payload);
        state.error = null;
      })
      .addCase(createAdviser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update adviser
      .addCase(updateAdviser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdviser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.adviserDetails.findIndex(
          (adviser) => adviser.uuid === action.payload.uuid
        );
        if (index !== -1) {
          state.adviserDetails[index] = action.payload;
        }
        if (state.selectedAdviser?.uuid === action.payload.uuid) {
          state.selectedAdviser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAdviser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update adviser by token
      .addCase(updateAdviserByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdviserByToken.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.adviserDetails.findIndex(
          (adviser) => adviser.uuid === action.payload.uuid
        );
        if (index !== -1) {
          state.adviserDetails[index] = action.payload;
        }
        if (state.selectedAdviser?.uuid === action.payload.uuid) {
          state.selectedAdviser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAdviserByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete adviser
      .addCase(deleteAdviser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdviser.fulfilled, (state, action) => {
        state.loading = false;
        state.adviserDetails = state.adviserDetails.filter(
          (adviser) => adviser.uuid !== action.payload
        );
        if (state.selectedAdviser?.uuid === action.payload) {
          state.selectedAdviser = null;
        }
        state.error = null;
      })
      .addCase(deleteAdviser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch assignments
      .addCase(fetchAdviserAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdviserAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
        state.error = null;
      })
      .addCase(fetchAdviserAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAdviser, clearAdviserError, clearAssignments } = adviserDetailSlice.actions;

// Selectors
export const selectAdviserDetails = (state: RootState) => state.adviserDetail.adviserDetails;
export const selectSelectedAdviser = (state: RootState) => state.adviserDetail.selectedAdviser;
export const selectAdviserAssignments = (state: RootState) => state.adviserDetail.assignments;
export const selectAdviserLoading = (state: RootState) => state.adviserDetail.loading;
export const selectAdviserError = (state: RootState) => state.adviserDetail.error;

export default adviserDetailSlice.reducer;
