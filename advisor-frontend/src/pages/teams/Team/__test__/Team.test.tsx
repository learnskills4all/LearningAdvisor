import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import client from "../../../../app/client";
import { store } from "../../../../app/store";
import INGTheme from "../../../../Theme";
import Team from "../Team";

const teamInfo = {
  id: 1,
  name: "New Team",
  inviteToken: 123,
  country: "Netherlands",
  department: "IT",
};

test("team info rendering for user", async () => {
  const result = render(
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <Team
            theme={INGTheme}
            presetTeamInfo={teamInfo}
            presetUserRole="USER"
          />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
  const it = "IT Area / Department";
  expect(screen.getByText(/Team Information/i)).toBeInTheDocument();
  expect(screen.getByText(teamInfo.country)).toBeInTheDocument();
  expect(screen.getByText(teamInfo.department)).toBeInTheDocument();
  expect(screen.getByText(/Country/i)).toBeInTheDocument();
  expect(screen.getByText(teamInfo.name)).toBeInTheDocument();
  expect(screen.getByText(it)).toBeInTheDocument();
  expect(screen.getByText(/Facilitators/i)).toBeInTheDocument();
  expect(screen.getByText(/Members/i)).toBeInTheDocument();
  expect(screen.getByText(/Ongoing Evaluations/i)).toBeInTheDocument();
  expect(screen.getByText(/Completed evaluations/i)).toBeInTheDocument();
  expect(result.container.querySelector("#token-info")).not.toBeInTheDocument();
});

test("team info rendering for assessor", async () => {
  const result = render(
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <Team
            theme={INGTheme}
            presetTeamInfo={teamInfo}
            presetUserRole="ASSESSOR"
          />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );

  expect(screen.getByText(/Team Information/i)).toBeInTheDocument();
  expect(screen.getByText(/Country/i)).toBeInTheDocument();
  expect(screen.getByText(/Facilitators/i)).toBeInTheDocument();
  expect(screen.getByText(/Members/i)).toBeInTheDocument();
  expect(screen.getByText(/Ongoing Evaluations/i)).toBeInTheDocument();
  expect(screen.getByText(/Completed evaluations/i)).toBeInTheDocument();
  expect(result.container.querySelector("#token-info")).toBeInTheDocument();
  const copyTokenButton = screen.getByTestId("copy-token");
  fireEvent.click(copyTokenButton);
});

// describe block = test suite
// test block = test case
// test suite can have multiple test cases
