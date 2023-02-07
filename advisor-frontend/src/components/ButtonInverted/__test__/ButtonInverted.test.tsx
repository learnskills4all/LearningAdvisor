import { render, cleanup, fireEvent } from "@testing-library/react";
import ButtonInverted from "../ButtonInverted";

//  cleanup after each test case
afterEach(cleanup);

// test rendering of the inverted button and clicking
it("Rendering without crash and click", () => {
  const { getByText } = render(<ButtonInverted text="ClickButton" />);
  expect(getByText("ClickButton")).toBeInTheDocument();
  fireEvent.click(getByText("ClickButton"));
});
