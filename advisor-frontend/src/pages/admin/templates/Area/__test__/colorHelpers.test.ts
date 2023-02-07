import INGTheme from "../../../../../Theme";
import * as helpers from "../colorHelpers";

describe("Testing color and theming helper functions", () => {
  const colorString = "#AB0078";

  const stringToHexNumber = (string: string) => parseInt(string.slice(1), 16);
  const hexColor = stringToHexNumber(colorString);

  it("get lighter color", () => {
    expect(
      parseInt(helpers.lightenDarkenColor(colorString, 20).slice(1), 16)
    ).toBeGreaterThan(hexColor);
  });

  it("get darker color", () => {
    expect(
      parseInt(helpers.lightenDarkenColor(colorString, -20).slice(1), 16)
    ).toBeLessThan(hexColor);
  });

  it("get updated theme", () => {
    const newTheme = helpers.getUpdatedTheme(colorString, INGTheme);

    expect(stringToHexNumber(newTheme.palette.primary.main)).toEqual(hexColor);
    expect(stringToHexNumber(newTheme.palette.primary.dark)).toBeLessThan(
      hexColor
    );
    expect(stringToHexNumber(newTheme.palette.primary.light)).toBeGreaterThan(
      hexColor
    );
  });
});
