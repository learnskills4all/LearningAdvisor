import PersonIcon from "@mui/icons-material/Person";
import PageCard from "../PageCard";
import individual from "../Images/individual.png";

/**
 * return individual card containing
 * a bodytext: "View and start evaluations",
 * a headertext: "Individuals",
 * and a "person"-icon with an image at the right side
 * of the card
 */
export default function IndividualCard() {
  return (
    <PageCard
      bodyText="View and start evaluations"
      headerText="Individuals"
      cardHeight="15vh"
      icon={
        <PersonIcon
          color="info"
          fontSize="large"
          className="inverse_icon"
          sx={{
            bgcolor: "primary.main",
          }}
        />
      }
      image={individual}
      isImageRight
    />
  );
}
