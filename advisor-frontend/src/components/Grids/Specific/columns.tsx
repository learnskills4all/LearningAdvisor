import { IconButton } from "@mui/material";
import UpwardIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import DownwardIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

/**
 * Returns component for rendering the up/down order cell
 * @param handleUpward
 * @param handleDownward
 * @returns Component for rendering the up/down order cell
 */
// eslint-disable-next-line import/prefer-default-export
export function RenderEditCell({
  handleUpward,
  handleDownward,
}: {
  handleUpward: () => void;
  handleDownward: () => void;
}) {
  return (
    <div className="parent">
      <div className="child">
        <IconButton onClick={handleUpward}>
          <UpwardIcon />
        </IconButton>
      </div>
      <div className="child">
        <IconButton onClick={handleDownward}>
          <DownwardIcon />
        </IconButton>
      </div>
    </div>
  );
}
