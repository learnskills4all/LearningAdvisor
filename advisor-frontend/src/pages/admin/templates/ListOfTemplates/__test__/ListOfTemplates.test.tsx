import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import client from "../../../../../app/client";
import { store } from "../../../../../app/store";
import Theme from "../../../../../Theme";
import ListOfTemplates from "../ListOfTemplatesIndividual";

test("app render list of templates", async () => {
  render(
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <ListOfTemplates theme={Theme} />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
  expect(screen.getByText(/Individual Templates/i)).toBeInTheDocument();
  expect(screen.getByText(/Team Templates/i)).toBeInTheDocument();
});

// describe block = test suite
// test block = test case
// test suite can have multiple test cases
