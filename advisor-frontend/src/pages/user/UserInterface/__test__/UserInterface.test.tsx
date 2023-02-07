import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../../../../app/store";
import UserInterface from "../UserInterface";

const queryClient = new QueryClient();

test("app rendering/navigating from user interface to self-evals", async () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserInterface />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(
    screen.getByText(/View and start individual evaluations/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/View your teams/i)).toBeInTheDocument();
  const button = screen.getByTestId("user-evals");
  fireEvent.click(button);
});

test("app rendering/navigating from user interface to teams", async () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserInterface />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(
    screen.getByText(/View and start individual evaluations/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/View your teams/i)).toBeInTheDocument();
  const button = screen.getByTestId("user-teams");
  fireEvent.click(button);
});
