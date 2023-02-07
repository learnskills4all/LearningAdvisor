/* eslint-disable no-bitwise */
import { createTheme, Theme } from "@mui/material";

/**
 * Given a hex color string (including the #), it returns a lighter or darker version of
 * that color as another hex color string
 * @param color the color to start from
 * @param amt the value used to darken or lighten, a negative number will produce a darker color
 *  a positive number will produce a lighter color
 * @returns a darkened or lightened version of the color
 */
export const lightenDarkenColor = (color: string, amt: number) => {
  // remove the # and transform into number of base 16
  const colorNumber = parseInt(color.slice(1), 16);
  const newColor = (
    ((colorNumber & 0x0000ff) + amt) |
    ((((colorNumber >> 8) & 0x00ff) + amt) << 8) |
    (((colorNumber >> 16) + amt) << 16)
  ).toString(16);
  return `#${newColor}`;
};

/**
 * Get an updated version of the theme based on a new main primary color.
 * The light and dark primary colors change accordingly
 * @param primaryColor the new main primary color
 * @param theme the theme object to update
 * @returns a new theme object with the new primary colors
 */
export const getUpdatedTheme = (primaryColor: string, theme: Theme) =>
  createTheme(theme, {
    palette: {
      primary: {
        main: primaryColor,
        // get lighter version of main programmatically
        light: lightenDarkenColor(primaryColor, 20),
        // get darker version of main programmatically
        dark: lightenDarkenColor(primaryColor, -20),
      },
    },
  });

export default getUpdatedTheme;
