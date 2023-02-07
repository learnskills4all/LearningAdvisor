import { createGlobalStyle } from "styled-components";
import Theme from "./Theme";

/**
 * In this file the global styles are defined that is used
 * for e.g. user/admin/assessor pages related to CSS that can be used/linked in
 * different files in which e.g. components have been made
 * An example of this would be the right arrow button color in grids for redirection
 */
const GlobalStyles = createGlobalStyle`
  h2 {
    color: ${Theme.palette.text.secondary};
    width: inherit;
    text-align: left;
    margin-top: 10px;
    margin-bottom: 0px;
  }
  h3 {
    color: ${Theme.palette.text.secondary};
    width: inherit;
    text-align: left;
    margin-top: 10px;
    margin-bottom: 0px;
  }
  .MuiOutlinedInput-input { 
    background-color: white !important;
  }
  p {
    width: inherit;
  }
  .arrowIcon {
    color: ${Theme.palette.primary.main};
  }
  .checkboxIcon {
    color: ${Theme.palette.secondary.main};
  }
`;

export default GlobalStyles;
