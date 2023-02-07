import { cleanup } from "@testing-library/react";
import { store } from "../store";
import { setUserId, setUserRole } from "../userDataSlice";

afterEach(cleanup);

it("userRole change", () => {
  // Fetch the default userRole value
  let state = store.getState().userData;
  const oldRole = state.userRole;
  // Change the userRole state
  store.dispatch(setUserRole("USER"));
  // Fetch new userRole
  state = store.getState().userData;
  const newRole = state.userRole;

  expect(oldRole).not.toEqual(newRole);
});

it("userID change", () => {
  // Fetch the default userID value
  let state = store.getState().userData;
  const oldID = state.userId;
  // Change the userID state
  store.dispatch(setUserId("u19283547"));
  // Fetch new userID
  state = store.getState().userData;
  const newID = state.userId;

  expect(oldID).not.toEqual(newID);
});
