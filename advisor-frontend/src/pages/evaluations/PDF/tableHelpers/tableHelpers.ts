import JsPDF from "jspdf";

export type DocProps = {
  pageMargin: number;
  liveArea: { width: number; height: number };
  padding: number;
};

/**
 * This function check if there is still space to write on the document
 * If not, it adds a new page
 * it then returns the next y value
 * @param doc JsPDF document object
 * @param nextY y position of where to place next element
 * @param endOfPage y value of where page ends
 * @param pageMargin margin of page
 * @param addition optional argument that allows to check
 *   e.g. whether an element of height @param addition fits on page
 * @returns next y position available on the page
 */
export function nextYCheckEndOfPage(
  doc: JsPDF,
  nextY: number,
  endOfPage: number,
  pageMargin: number,
  addition = 0
) {
  // if there isn't enough space, add new page
  if (nextY + addition >= endOfPage) {
    doc.addPage();
    return pageMargin;
  }
  return nextY;
}

/**
 * This functions generates the header of a table
 * @param doc JsPDF document object to write on
 * @param headers list of titles of table columns
 * @param docProps properties of the pages of the document
 * @param nextYValue next y position available to write on
 * @param firstColWidth width of first column
 * @param colWidth width of the rest of the columns
 * @returns next y position available to write on after adding the table headers
 */
export function generateTableHeaders(
  doc: JsPDF,
  headers: string[],
  docProps: DocProps,
  nextYValue: number,
  firstColWidth: number,
  colWidth: number
) {
  let nextY = nextYValue;
  const { liveArea, pageMargin, padding } = docProps;
  const xPositions: number[] = [];

  // iterate through column names
  headers.forEach((heading: string, index: number) => {
    // the first column gets x position equal to the page margin
    // for the rest of the columns ("regular" columns) we also need to take into account
    // the first column width, and then add up colWidth based on how
    // many "regular" columns were already added
    const xPositionForCurrentHeader =
      index === 0
        ? pageMargin
        : pageMargin + firstColWidth + (index - 1) * colWidth;

    const yPositionForHeaders = nextY;

    // add column name based on x and y positions
    doc.text(
      heading,
      index === 0
        ? xPositionForCurrentHeader
        : xPositionForCurrentHeader + padding,
      yPositionForHeaders
    );

    // save x position of current column
    xPositions.push(
      index === 0
        ? xPositionForCurrentHeader
        : xPositionForCurrentHeader + padding
    );
  });

  nextY += +5;

  // generate line after header
  doc.line(pageMargin, nextY, liveArea.width, nextY);

  // add some padding
  nextY += padding;

  return { xPositions, nextY };
}

/**
 * This function adds a row to a table on a document
 * @param doc jsPDF document object to write on
 * @param headers names of columns
 * @param row list of column values for specified row
 * @param colWidth width of "regular" columns
 * @param padding padding value used after each row
 * @param firstColWidth width of first column
 * @param xPositions x positions of columns
 * @param nextY next y position available to write on
 * @returns next y position available after adding new row
 */
export function generateTableRow(
  doc: JsPDF,
  headers: string[],
  row: (string | number)[],
  colWidth: number,
  padding: number,
  firstColWidth: number,
  xPositions: number[],
  nextY: number
) {
  const rowHeights: number[] = [];
  // iterate columns
  headers.forEach((_column: string, cIndex) => {
    // split text based on column width
    const longText = doc.splitTextToSize(
      String(row[cIndex]),
      cIndex !== 0 ? colWidth - padding * 2 : firstColWidth - padding * 2
    );

    // save row text height
    const rowHeight = longText.length * doc.getLineHeight();
    rowHeights.push(rowHeight);

    // text to the document
    doc.text(longText, xPositions[cIndex], nextY);
  });

  // return nextY based on padding and largest row text height
  return nextY + padding + Math.max(...rowHeights);
}

/**
 * generate text on specified document
 * @param doc JsPDF document to write on
 * @param text text to write
 * @param docProps properties of document to write on
 * @param fontSize font size of text
 * @param nextYValue next y position available to write on
 * @param fontWeight font weight of text
 * @returns next y position available to write on after adding text
 */
export function generateText(
  doc: JsPDF,
  text: string,
  docProps: {
    pageMargin: number;
    liveArea: { width: number; height: number };
    padding: number;
  },
  fontSize: number,
  nextYValue: number,
  fontWeight = "normal"
) {
  let nextY = nextYValue;
  // skip if there is not text
  if (text !== "") {
    // set font properties in the document
    doc.setFontSize(fontSize).setFont(doc.getFont().fontName, fontWeight);
    const { liveArea, pageMargin } = docProps;

    // split text based on width of live area of the document
    const textfield = doc.splitTextToSize(text, liveArea.width - pageMargin);
    const textfieldHeight = textfield.length * doc.getLineHeight();

    // get next Y based on whether there is space in the page
    nextY = nextYCheckEndOfPage(
      doc,
      nextY,
      liveArea.height,
      pageMargin,
      textfieldHeight
    );

    // add text to the document
    doc.text(textfield, pageMargin, nextY);

    // update next y with minor padding
    nextY += 3 + textfieldHeight;
  }
  return nextY;
}
