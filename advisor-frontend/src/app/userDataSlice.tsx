import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../types/UserRole";

/**
 * Creates an interface to set the global state variables
 */
export interface UserDataState {
  userId: string;
  userRole: UserRole;
  userName: string;
  userPassword: string;
}
/**
 * Initializes the global state variables
 */
const initialState: UserDataState = {
  userId: "0000",
  userRole: "NONE",
  userName: "",
  userPassword: "",
};

/**
 * Redux Toolkit based state manager that handles the state manipulation
 */
export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    // Sets the userID in the global state variable with the supplied variable
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    // Sets the current userRole in the global state variable with the supplied variable
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.userRole = action.payload;
    },
    // Resets the userData back to initial
    resetUser(state) {
      state.userId = initialState.userId;
      state.userRole = initialState.userRole;
    },
    // Save the new userName in the session state
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    // Save the new password in the session state
    setPassword: (state, action: PayloadAction<string>) => {
      state.userPassword = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserId, setUserRole, resetUser, setUserName, setPassword } =
  userDataSlice.actions;

export default userDataSlice.reducer;
