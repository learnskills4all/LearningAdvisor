import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { store } from "../../../../app/store";
import AdminInterface from "../AdminInterface";

const queryClient = new QueryClient();

test("app rendering/navigating from admin interface to individuals", async () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AdminInterface />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByText(/Admin Home/i)).toBeInTheDocument();
});

// describe block = test suite
// test block = test case
// test suite can have multiple test cases
