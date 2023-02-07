import { render, cleanup, screen } from "@testing-library/react";
import Header from "../Header";

afterEach(cleanup);

it("rendering without crash", () => {
  render(<Header name="TestHeader" />);
  const headerContainer = screen.getByTestId("headerID");
  expect(headerContainer).toHaveTextContent("TestHeader"); // the correct one
  // expect(getByTestId('Button')).toHaveTextContent("ClickButton2") // on purpose created an error
});
