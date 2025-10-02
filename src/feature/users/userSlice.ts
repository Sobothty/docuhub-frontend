import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserResponse, UserCreateDto, UpdateUserDto, UserProfileResponse, LoginDto } from '@/types/userType';
import { RootState } from '@/lib/store';
import apiService from '@/services/api';

interface UserState {
  users: UserResponse[];
  currentUser: UserProfileResponse | null;
  selectedUser: UserResponse | null;
  publicUsers: { content: UserResponse[]; totalElements: number; totalPages: number; number: number } | null;
  students: { content: UserResponse[]; totalElements: number; totalPages: number; number: number } | null;
  advisers: { content: UserResponse[]; totalElements: number; totalPages: number; number: number } | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  selectedUser: null,
  publicUsers: null,
  students: null,
  advisers: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: UserCreateDto, { rejectWithValue }) => {
    try {
      return await apiService.auth.register(userData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.auth.getUserProfile();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch current user');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.users.getAllUsers();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
);

export const fetchUsersByPage = createAsyncThunk(
  'user/fetchByPage',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      return await apiService.users.getUsersByPage(page, size);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
);

export const fetchUserByUuid = createAsyncThunk(
  'user/fetchByUuid',
  async (uuid: string, { rejectWithValue }) => {
    try {
      return await apiService.users.getUserByUuid(uuid);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ uuid, userData }: { uuid: string; userData: UpdateUserDto }, { rejectWithValue }) => {
    try {
      await apiService.users.updateUser(uuid, userData);
      return { uuid, userData };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await apiService.users.deleteUser(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
);

export const fetchPublicUsers = createAsyncThunk(
  'user/fetchPublic',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      return await apiService.users.getPublicUsers(page, size);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch public users');
    }
  }
);

export const fetchStudents = createAsyncThunk(
  'user/fetchStudents',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      return await apiService.users.getAllStudents(page, size);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch students');
    }
  }
);

export const fetchAdvisers = createAsyncThunk(
  'user/fetchAdvisers',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      return await apiService.users.getAllAdvisers(page, size);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch advisers');
    }
  }
);

export const promoteToStudent = createAsyncThunk(
  'user/promoteToStudent',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await apiService.users.promoteToStudent(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to promote to student');
    }
  }
);

export const promoteToAdviser = createAsyncThunk(
  'user/promoteToAdviser',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await apiService.users.promoteToAdviser(uuid);
      return uuid;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to promote to adviser');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<UserResponse | null>) => {
      state.selectedUser = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.users = [];
      state.selectedUser = null;
      state.publicUsers = null;
      state.students = null;
      state.advisers = null;
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch users by page
      .addCase(fetchUsersByPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByPage.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.error = null;
      })
      .addCase(fetchUsersByPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch user by UUID
      .addCase(fetchUserByUuid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUuid.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserByUuid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.uuid === action.payload.uuid);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload.userData };
        }
        if (state.selectedUser?.uuid === action.payload.uuid) {
          state.selectedUser = { ...state.selectedUser, ...action.payload.userData };
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.uuid !== action.payload);
        if (state.selectedUser?.uuid === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch public users
      .addCase(fetchPublicUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.publicUsers = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch advisers
      .addCase(fetchAdvisers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvisers.fulfilled, (state, action) => {
        state.loading = false;
        state.advisers = action.payload;
        state.error = null;
      })
      .addCase(fetchAdvisers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Promote to student
      .addCase(promoteToStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(promoteToStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.uuid === action.payload);
        if (index !== -1) {
          state.users[index].isStudent = true;
        }
        state.error = null;
      })
      .addCase(promoteToStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Promote to adviser
      .addCase(promoteToAdviser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(promoteToAdviser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.uuid === action.payload);
        if (index !== -1) {
          state.users[index].isAdvisor = true;
        }
        state.error = null;
      })
      .addCase(promoteToAdviser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedUser, clearUserError, logout, setAuthenticated } = userSlice.actions;

// Selectors
export const selectUsers = (state: RootState) => state.user.users;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser;
export const selectPublicUsers = (state: RootState) => state.user.publicUsers;
export const selectStudents = (state: RootState) => state.user.students;
export const selectAdvisers = (state: RootState) => state.user.advisers;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;