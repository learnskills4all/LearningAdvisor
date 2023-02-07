import BarChartIcon from "@mui/icons-material/BarChart";
import PageCard from "../PageCard";
import individualEvaluation from "../Images/individualEvaluation.png";

/**
 * function that returns the evaluation card containing
 * bodytext: View and start individual evaluations
 * headertext: Individual Evaluations
 * and a barchart icon with an image at the left side of the card
 */
export default function EvaluationCard() {
  return (
    <PageCard
      bodyText="View and start individual evaluations"
      headerText="Individual Evaluations"
      cardHeight="15vh"
      icon={
        <BarChartIcon
          color="info"
          fontSize="large"
          className="inverse_icon"
          sx={{
            bgcolor: "primary.main",
          }}
        />
      }
      image={individualEvaluation}
      isImageLeft
    />
  );
}
