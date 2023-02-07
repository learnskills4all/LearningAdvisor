import EditIcon from "@mui/icons-material/Edit";
import PageCard from "../PageCard";
import template from "../Images/template.png";

/**
 * function that returns a template card with
 * view, create and edit evaluation templates as bodytext,
 * templates as header text,
 * an "edit"-icon and an image on the left side
 * NOTE: this templatecard you will see in the administrator interface
 */
export default function TemplateCard() {
  return (
    <PageCard
      bodyText="View, create and edit evaluation templates"
      headerText="Templates"
      cardHeight="15vh"
      icon={
        <EditIcon
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
