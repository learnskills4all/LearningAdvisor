import { render, cleanup, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import PageLayout from "./PageLayout";
import userTypes from "../components/Sidebar/listUsersTypes";
import { store } from "../app/store";

afterEach(cleanup);
const queryClient = new QueryClient();

const titleTest = "test";
const bodyTest = "this is a body test";

it("PageLayout rendering without crash", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PageLayout title={titleTest} sidebarType={userTypes.ADMIN}>
            {bodyTest}
          </PageLayout>
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent(bodyTest);
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent(titleTest);
});
