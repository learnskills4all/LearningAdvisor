import GroupIcon from '@mui/icons-material/Group';
import PageCard from "../PageCard";
import individual from "../Images/individual.png";

/**
 * return individual card containing
 * a bodytext: "View and start evaluations",
 * a headertext: "Individuals",
 * and a "person"-icon with an image at the right side
 * of the card
 */
export default function TeamTemplate() {
  return (
    <PageCard
      bodyText="View, create and edit team evaluation templates"
      headerText="Team Templates"
      cardHeight="15vh"
      icon={
        <GroupIcon
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
