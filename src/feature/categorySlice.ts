// slices/categorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from './categoriesSlice/categoriesSlices';

interface CategoryState {
  selectedCategory: Category | null;
  isModalOpen: boolean;
  isDeleteModalOpen: boolean;
}

const initialState: CategoryState = {
  selectedCategory: null,
  isModalOpen: false,
  isDeleteModalOpen: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedCategory = null;
    },
    openDeleteModal: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.selectedCategory = null;
    },
  },
});

export const {
  setSelectedCategory,
  openModal,
  closeModal,
  openDeleteModal,
  closeDeleteModal,
} = categorySlice.actions;

export default categorySlice.reducer;