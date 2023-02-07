import JsPDF from "jspdf";
import * as helpers from "../tableHelpers";

describe("Testing PDF helper function related to tables", () => {
  const docProps = {
    padding: 15,
    liveArea: { width: 1000, height: 1000 },
    pageMargin: 50,
  };

  const doc = new JsPDF({
    orientation: "l",
    unit: "pt",
    format: "a4",
  });

  it("check create new page when nextY is at end of page", () => {
    expect(
      helpers.nextYCheckEndOfPage(
        doc,
        docProps.liveArea.height,
        docProps.liveArea.height,
        docProps.pageMargin
      )
    ).toStrictEqual(docProps.pageMargin);
  });

  const textHeight = 30;
  it("check create new page when text would go over page", () => {
    expect(
      helpers.nextYCheckEndOfPage(
        doc,
        docProps.liveArea.height - textHeight + 10,
        docProps.liveArea.height,
        docProps.pageMargin,
        textHeight
      )
    ).toStrictEqual(docProps.pageMargin);
  });

  let nextY = docProps.liveArea.height - textHeight - 10;

  it("don't create a new page when text fits", () => {
    expect(
      helpers.nextYCheckEndOfPage(
        doc,
        nextY,
        docProps.liveArea.height,
        docProps.pageMargin,
        textHeight
      )
    ).toStrictEqual(nextY);
  });

  const headers = ["col1", "col2"];
  const firstColWidth = 70;
  const colWidth = 80;
  const xPositions = [
    docProps.pageMargin,
    docProps.pageMargin + firstColWidth + docProps.padding,
  ];

  it("check xPositions and nextY when creating table headers", () => {
    expect(
      helpers.generateTableHeaders(
        doc,
        headers,
        docProps,
        nextY,
        firstColWidth,
        colWidth
      )
    ).toStrictEqual({ xPositions, nextY: nextY + 5 + docProps.padding });
  });

  nextY = docProps.pageMargin;
  doc.setFontSize(10);
  const textfield = doc.splitTextToSize("hello", docProps.liveArea.width);
  const textfieldHeight = textfield.length * doc.getLineHeight();

  it("check nextY when generating text", () => {
    expect(
      helpers.generateText(doc, "hello", docProps, 10, nextY)
    ).toStrictEqual(nextY + 3 + textfieldHeight);
  });

  it("check nextY when generating row", () => {
    expect(
      helpers.generateTableRow(
        doc,
        headers,
        ["hello", "hello"],
        colWidth,
        docProps.padding,
        firstColWidth,
        xPositions,
        nextY
      )
    ).toStrictEqual(nextY + textfieldHeight + docProps.padding);
  });
});
