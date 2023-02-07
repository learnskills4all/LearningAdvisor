import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import client from "../../../../app/client";
import { store } from "../../../../app/store";
import INGTheme from "../../../../Theme";
import TeamList from "../TeamList";

test("app rendering/navigating from assessor view to specific team", async () => {
  render(
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <TeamList theme={INGTheme} />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
  const tokenButton = screen.getByText(/Join team with token/i);
  const tokenField = screen.getByLabelText(/Enter token/i);
  expect(tokenButton).toBeInTheDocument();
  fireEvent.change(tokenField, { target: { value: "23" } });
  fireEvent.click(tokenButton);
});

// describe block = test suite
// test block = test case
// test suite can have multiple test cases
