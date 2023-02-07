import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Divider from "@mui/material/Divider";

/**
 * a card consist of:
 * title with a small logo
 * a seperator line (divider)
 * a body text
 * optionally: an JPEG/PNG/JPG image at the right side and/or left side
 * title divider and body text are aligned left
 * the card title and body text are darkgrey according style
 * the logo in the title is ING orange
 * the color of the JPG/PNG image must be set in the image itself (in this case also ING orange)
 * there might be an image on the left or on the right or both
 */
type PageCardProps = {
  headerText: string;
  bodyText: string;
  cardHeight: string;
  icon: JSX.Element;
  image: string;
  isImageLeft?: boolean;
  isImageRight?: boolean;
};

const defaultProps = {
  isImageLeft: false,
  isImageRight: false,
};

/**
 * Function that displays an image
 * The size is always 33% of the viewer width
 * and opacity is 0.4
 */
function CardImage(ch: string, img: string) {
  return (
    <div style={{ minWidth: "33vw", height: ch, backgroundColor: "#FF6222" }}>
      <img
        style={{
          width: "33vw",
          height: ch,
          objectFit: "cover",
          opacity: 0.4,
        }}
        src={img}
        alt="ING"
      />
    </div>
  );
}

/**
 * Function that displays a pagecard component consisting of
 * body text, headertext with icon next to it, optionally
 * an image on the left and/or the right
 * set by boolean isImageLeft and isImageRight
 */
export default function PageCard({
  bodyText,
  headerText,
  cardHeight,
  icon,
  image,
  isImageLeft,
  isImageRight,
}: PageCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        verticalAlign: "middle",
        width: "inherit",
        borderRadius: "20px",
        marginBottom: "10px",
      }}
    >
      {/* if Cardmedia,add image to the left side */}
      {isImageLeft && CardImage(cardHeight, image)}
      {/* set the width of the card */}
      <Box width="100vw" height={cardHeight} bgcolor="white">
        <CardContent>
          {/* Use align="left" if alignment of title, divider and body text is left and JPG/PNG image is on the right, reverse if otherwise
           */}
          <Typography
            color="text.secondary"
            align="left"
            sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
            variant="h6"
          >
            {/* Here should be the title of the card
             */}
            {headerText}
            {icon}
          </Typography>
          {/* Use textAlign="left" if alignment of title, divider and body text is left and JPG/PNG image is on the right, reverse if otherwise
           */}
          <Divider textAlign="left" />
          {/* Use align="left" if alignment of title and body text is left and JPG/PNG image is on the right, reverse if otherwise
           */}
          <Typography
            variant="subtitle1"
            align="left"
            color="text.secondary"
            component="div"
          >
            {bodyText}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }} />
      </Box>
      {/* if Cardmedia,add image to the right side */}
      {isImageRight && CardImage(cardHeight, image)}
    </Card>
  );
}
PageCard.defaultProps = defaultProps;
