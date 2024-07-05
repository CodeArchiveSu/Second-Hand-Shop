import { configureStore, createSlice } from "@reduxjs/toolkit";
import { products } from "./@types";

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
const initialState2: products[] = [];

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

const productSlice = createSlice({
  name: "products",
  initialState: initialState2,
  reducers: {
    setNewProducts(state, action) {
      console.log("from store", action.payload);
      state.push(action.payload);
    },
  },
});

export const { setUser, userLogout } = userSlice.actions;
export const { setNewProducts } = productSlice.actions;

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    products: productSlice.reducer,
  },
});
