import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../../../app/store";
import AssessorInterface from "../AssessorInterface";

const queryClient = new QueryClient();

test("app rendering/navigating from assessor interface to teams", async () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AssessorInterface />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByText(/View your teams/i)).toBeInTheDocument();
  const button = screen.getByTestId("assessor-teams");
  fireEvent.click(button);
});

// describe block = test suite
// test block = test case
// test suite can have multiple test cases
