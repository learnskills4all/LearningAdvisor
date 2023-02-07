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
export default function ImportTemplateCard() {
  return (
    <PageCard
      bodyText="Import new templates using excel files"
      headerText="Import Templates"
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
      isImageRight
    />
  );
}
