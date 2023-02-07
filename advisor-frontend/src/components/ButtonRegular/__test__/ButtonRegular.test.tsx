import { render, cleanup, fireEvent } from "@testing-library/react";
import ButtonRegular from "../ButtonRegular";

//  cleanup after each test case
afterEach(cleanup);

//  test rendering of the regular button and clicking
it("Rendering without crash and click", () => {
  const { getByText } = render(<ButtonRegular text="ClickButton" />);
  expect(getByText("ClickButton")).toBeInTheDocument();
  fireEvent.click(getByText("ClickButton"));
});
