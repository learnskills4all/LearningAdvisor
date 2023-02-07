import { Button } from "@mui/material";

/**
 * fill regular button with ING orange color according to style
 * fonttext is bold
 * style is filled with background fontcolor
 * size of the button is depending on the length of the button text string
 */
function ButtonRegular({ text }: { text: string }) {
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        style={{ fontWeight: "600" }}
        onClick={() => {
          //  alert("Clicked")
          //  action when clicking the button
        }}
      >
        {text}
      </Button>
    </div>
  );
}

export default ButtonRegular;
