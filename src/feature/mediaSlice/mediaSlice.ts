import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import apiService from '@/services/api';

interface MediaUploadResponse {
  message: string;
  data: {
    name: string;
    uri: string;
    size: number;
    created_date: string;
  };
}

interface MediaState {
  uploadedFiles: MediaUploadResponse['data'][];
  uploadProgress: number;
  loading: boolean;
  error: string | null;
  currentUpload: MediaUploadResponse | null;
}

const initialState: MediaState = {
  uploadedFiles: [],
  uploadProgress: 0,
  loading: false,
  error: null,
  currentUpload: null,
};

// Async thunks for media operations
export const uploadFile = createAsyncThunk(
  'media/upload',
  async (file: File, { rejectWithValue }) => {
    try {
      return await apiService.media.uploadFile(file);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload file');
    }
  }
);

export const deleteMedia = createAsyncThunk(
  'media/delete',
  async (filename: string, { rejectWithValue }) => {
    try {
      await apiService.media.deleteMedia(filename);
      return filename;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete media');
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearMediaError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
    clearCurrentUpload: (state) => {
      state.currentUpload = null;
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUpload = action.payload;
        state.uploadedFiles.push(action.payload.data);
        state.uploadProgress = 100;
        state.error = null;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      })

      // Delete media
      .addCase(deleteMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFiles = state.uploadedFiles.filter(
          file => !file.uri.includes(action.payload)
        );
        state.error = null;
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearMediaError,
  setUploadProgress,
  resetUploadProgress,
  clearCurrentUpload,
  clearUploadedFiles,
} = mediaSlice.actions;

// Selectors
export const selectUploadedFiles = (state: RootState) => state.media.uploadedFiles;
export const selectUploadProgress = (state: RootState) => state.media.uploadProgress;
export const selectMediaLoading = (state: RootState) => state.media.loading;
export const selectMediaError = (state: RootState) => state.media.error;
export const selectCurrentUpload = (state: RootState) => state.media.currentUpload;

export default mediaSlice.reducer;