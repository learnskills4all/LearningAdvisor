import GroupsIcon from "@mui/icons-material/Groups";
import PageCard from "../PageCard";
import testimageFigma from "../Images/testimageFigma.png";

/**
 * function that returns a teamcard with:
 * "view your teams" as bodytext,
 * "teams" as headertext with a group icon
 * with an image on the right side of the page card
 */
export default function TeamCard() {
  return (
    <PageCard
      bodyText="View your teams"
      headerText="Teams "
      cardHeight="15vh"
      icon={
        <GroupsIcon
          color="info"
          fontSize="large"
          className="inverse_icon"
          sx={{
            bgcolor: "primary.main",
          }}
        />
      }
      image={testimageFigma}
      isImageRight
    />
  );
}
