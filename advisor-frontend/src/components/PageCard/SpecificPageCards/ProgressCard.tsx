import ShowChartIcon from "@mui/icons-material/ShowChart";
import PageCard from "../PageCard";
import testimageFigma from "../Images/testimageFigma.png";

/**
 * function that returns a progresscard
 * with a bodytext: "View your current progress",
 * headertext: "Progress",
 * with a "show-cart"-icon, with an image
 */
export default function ProgressCard() {
  return (
    <PageCard
      bodyText="View your current progress"
      headerText="Progress"
      cardHeight="15vh"
      icon={
        <ShowChartIcon
          color="info"
          fontSize="large"
          className="inverse_icon"
          sx={{
            bgcolor: "primary.main",
          }}
        />
      }
      image={testimageFigma}
    />
  );
}
