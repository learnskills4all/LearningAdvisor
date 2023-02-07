import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { store } from "../../../app/store";
import PageLayout from "../../../pages/PageLayout";
import userTypes from "../listUsersTypes";

const queryClient = new QueryClient();

afterEach(cleanup);

it("user sidebar rendering without crash", () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PageLayout title="test" footer sidebarType={userTypes.USER}>
            testcase
          </PageLayout>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Home");
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Evaluations");
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Teams");
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Sign Out");
  expect(screen.getByTestId("SidebarTest")).not.toHaveTextContent("Templates");
  fireEvent.click(screen.getByTestId("DrawerButton"));
});
it("assessor sidebar rendering without crash", () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PageLayout title="test" footer sidebarType={userTypes.ASSESSOR}>
            testcase
          </PageLayout>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Home");
  expect(screen.getByTestId("SidebarTest")).not.toHaveTextContent(
    "Evaluations"
  );
  expect(screen.getByTestId("SidebarTest")).not.toHaveTextContent("Templates");
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Teams");
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Sign Out");
  fireEvent.click(screen.getByTestId("DrawerButton"));
});
it("admin sidebar rendering without crash", () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PageLayout title="test" footer sidebarType={userTypes.ADMIN}>
            testcase
          </PageLayout>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Home");
  expect(screen.getByTestId("SidebarTest")).not.toHaveTextContent(
    "Evaluations"
  );
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Templates");
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Individuals");
  expect(screen.getByTestId("SidebarTest")).toHaveTextContent("Sign Out");
  fireEvent.click(screen.getByTestId("DrawerButton"));
});
