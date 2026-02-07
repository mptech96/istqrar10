import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false,
    message: "",
  },
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (!action.payload) state.message = "";
    },
    startLoading: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.message = action.payload || "";
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.message = "";
    },
  },
});

export const { setIsLoading, startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;