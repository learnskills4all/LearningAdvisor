import { render, cleanup } from "@testing-library/react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PageCard from "../PageCard";

//  cleanup after each test case
afterEach(cleanup);

//  test rendering of the home page card with bodytext and title
it("Rendering without crash and check title and text on card", () => {
  const { getByText } = render(
    <PageCard
      headerText="This is a description for the home page card"
      bodyText="Title"
      cardHeight="120px"
      icon={<AssessmentIcon />}
      image="image"
      isImageLeft
      isImageRight
    />
  );
  expect(
    getByText("This is a description for the home page card")
  ).toBeInTheDocument();
  expect(getByText("Title")).toBeInTheDocument();
});
