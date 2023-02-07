import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import Area from "../Area";
import { store } from "../../../../../app/store";
import INGTheme from "../../../../../Theme";

const queryClient = new QueryClient();

test("app rendering the individual list", async () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Area theme={INGTheme} />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByTestId("areaTest")).toBeInTheDocument();
});
