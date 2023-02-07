import { ThemeOptions, ThemeProvider } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./Subarea.css";

/**
 * passing parameter of the title and description of the subarea
 * title of subarea
 * description of subarea = description
 * description might be empty string
 * theme of app
 * main function returning a subarea component
 * prop tip is used to make sure that when tip = true,
 * that only the word/string "TIP" will be coloured/printed in ING orange in a card
 */
function Subarea({
  title,
  description,
  summary,
  theme,
  tip,
}: {
  title: string;
  summary: string;
  description: string;
  theme: ThemeOptions;
  // eslint-disable-next-line react/require-default-props
  tip?: boolean;
}) {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ width: "inherit", alignSelf: "center" }}>
        <CardContent>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "left",
              color: "primary.main",
            }}
            id="subarea-title"
          >
            {title}
          </Typography>
          <Typography className="subareaText" id="subarea-summary">
            {summary}
          </Typography>
          <Typography
            className="subareaText"
            id="subarea-description"
            sx={{ color: "primary.main" }}
          >
            {tip && "TIP: "}
          </Typography>
          <Typography>{description}</Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default Subarea;
