import { render, cleanup, screen } from "@testing-library/react";
import Footer from "../Footer";

afterEach(cleanup);

it("rendering without crash", () => {
  render(<Footer />);
  const footerImg = screen.getByRole("img");
  expect(footerImg).toHaveAttribute(
    "src",
    "/src/components/Cards/footer_img.svg"
  ); // the correct one
  // expect(getByTestId('Button')).toHaveTextContent("ClickButton2") // on purpose created an error
});
