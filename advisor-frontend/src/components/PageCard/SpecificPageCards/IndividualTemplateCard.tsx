import PersonIcon from '@mui/icons-material/Person';
import PageCard from "../PageCard";
import template from "../Images/template.png";

/**
 * function that returns a template card with
 * view, create and edit evaluation templates as bodytext,
 * templates as header text,
 * an "edit"-icon and an image on the left side
 * NOTE: this templatecard you will see in the administrator interface
 */
export default function IndividualTemplateCard() {
  return (
    <PageCard
      bodyText="View, create and edit individual evaluation templates"
      headerText="Individual Templates"
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
      image={template}
      isImageLeft
    />
  );
}
