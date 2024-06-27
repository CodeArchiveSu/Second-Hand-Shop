import { configureStore, createSlice } from "@reduxjs/toolkit";

// export type initialState = {
//   message: string;
//   token: string;
//   user: Users;
// };

export type Users = {
  id: string;
  email: string;
  userDisplayName: string;
  avatar: string;
};

const initialState: Users | null = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      console.log("action.payload", action.payload);
      return action.payload;
    },
    userLogout(state, action) {
      return null;
    },
  },
});

export const { setUser, userLogout } = userSlice.actions;

export default configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
