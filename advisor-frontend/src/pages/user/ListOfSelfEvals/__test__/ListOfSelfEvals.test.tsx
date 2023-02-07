import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import client from "../../../../app/client";
import { store } from "../../../../app/store";
import Theme from "../../../../Theme";
import ListOfSelfEvals from "../ListOfSelfEvals";

test("app rendering the components of the user/evaluation page", async () => {
  render(
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <ListOfSelfEvals theme={Theme} />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
  expect(screen.getByText(/Ongoing Evaluations/i)).toBeInTheDocument();
  expect(screen.getByText(/Completed Evaluations/i)).toBeInTheDocument();
});
