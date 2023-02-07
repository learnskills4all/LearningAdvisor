import { Button } from "@mui/material";

/**
 * function that returns component button in inverted color scheme
 * text = button text
 * size of the button is depending on the length of the button text string
 */
function ButtonInverted({ text }: { text: string }) {
  return (
    <div>
      <Button
        /**
         * set background color of inverted button to white
         * style is outlined
         * fonttext is bold
         */
        sx={{
          backgroundColor: "white",
        }}
        variant="outlined"
        color="primary"
        style={{ fontWeight: "600" }}
        onClick={() => {
          //  alert("Clicked");
          //  action when clicking the button
        }}
      >
        {text}{" "}
      </Button>
    </div>
  );
}

export default ButtonInverted;
