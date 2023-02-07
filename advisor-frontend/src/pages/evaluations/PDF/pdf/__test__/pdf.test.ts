import JsPDF from "jspdf";
import * as pdf from "../pdf";

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

  const table = {
    title: "title",
    sections: [],
    data: [["word", "word"]],
    headers: ["one", "two"],
  };

  const nextY = docProps.pageMargin;
  const titleFontSize = 12;
  const textFontSize = 8;
  const sectFontSize = 10;
  doc.setFontSize(titleFontSize);
  const textfield1 = doc.splitTextToSize("title", docProps.liveArea.width);
  let finalValue = textfield1.length * doc.getLineHeight() + nextY + 3;
  finalValue += 5 + docProps.padding;
  doc.setFontSize(textFontSize);
  const textfield2 = doc.splitTextToSize("word", docProps.liveArea.width);
  finalValue += docProps.padding + textfield2.length * doc.getLineHeight();

  it("check nextY when creating a table", () => {
    expect(
      pdf.addTable(
        doc,
        table,
        docProps,
        nextY,
        textFontSize,
        sectFontSize,
        titleFontSize
      )
    ).toStrictEqual(finalValue);
  });
});
