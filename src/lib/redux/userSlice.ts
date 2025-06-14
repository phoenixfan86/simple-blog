import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string | null;
  email: string | null;
}

const initialState: UserState = {
  username: null,
  email: null,
};

interface LoginPayload {
  username: string;
  email: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    logout(state) {
      state.username = null;
      state.email = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
