import JsPDF from "jspdf";
import {
  getAnswerDictionary,
  getAnswers,
  getAreas,
  getTemplate,
  getTopicRecommendations,
  getTopics,
} from "../helpersAPI/pdfHelpersAPI";
import { Table, getRecTable, getAreaTables } from "../helpers/pdfHelpers";
import {
  nextYCheckEndOfPage,
  generateTableHeaders,
  generateTableRow,
  generateText,
  DocProps,
} from "../tableHelpers/tableHelpers";
import { AssessmentAPP } from "../../../../api/AssessmentAPI/AssessmentAPI";

/**
 * This function adds a specified table to a JsPDF document
 * @param doc JsPDF document to write the table on
 * @param table table object with the table properties
 * @param docProps properties of the JsPDF document
 * @param nextYValue next y value of where to write on the document
 * @param textFontSize font size of normal text
 * @param sectFontSize font size of title of the sections before the table
 * @param titleFontSize font sie of title of table
 * @returns next y value on the document after adding the table
 */
export function addTable(
  doc: JsPDF,
  table: Table,
  docProps: DocProps,
  nextYValue: number,
  textFontSize: number,
  sectFontSize: number,
  titleFontSize: number
) {
  let nextY = nextYValue;
  const { padding, liveArea, pageMargin } = docProps;

  // get next y value based on whether there is still space on the page
  const getNextYWrapper = (y: number, addition = 0) =>
    nextYCheckEndOfPage(doc, y, liveArea.height, pageMargin, addition);

  nextY = getNextYWrapper(nextY);

  // generate table title
  nextY = generateText(
    doc,
    table.title,
    docProps,
    titleFontSize,
    nextY,
    "bold"
  );

  // generate table sections
  table.sections.forEach((section) => {
    // check if there is still space on page
    //  and update next y based on that
    nextY = getNextYWrapper(nextY);

    // generate section title
    nextY = generateText(
      doc,
      section.title,
      docProps,
      sectFontSize,
      nextY,
      "bold"
    );

    // generate sections texts
    section.text
      .map((t) => t.split("\n"))
      .flat()
      .forEach((t) => {
        nextY = generateText(doc, t, docProps, textFontSize, nextY);
      });

    // add some padding
    nextY += 7 + padding;
  });

  // we set the first column to be 50 pts,
  // this is because all our tables have enumerations as the first columns
  const firstColWidth = 50;

  // calculate the width of the rest of the columns based on
  // first column and quantity of other columns
  const colWidth =
    (liveArea.width - firstColWidth) / (table.headers.length - 1);

  // reset font to normal text fontsize
  doc.setFontSize(textFontSize).setFont(doc.getFont().fontName, "normal");

  // generate table headers
  // save x positions of column text and next y position
  const { xPositions, nextY: nextYGenerated } = generateTableHeaders(
    doc,
    table.headers,
    docProps,
    nextY,
    firstColWidth,
    colWidth
  );

  nextY = nextYGenerated;

  // update nextY based on whether there is still space in the page
  nextY = getNextYWrapper(nextY);

  // iterate through rows
  table.data.forEach((row: (string | number)[]) => {
    // add row text and
    // update nextY with padding and taking into account
    // text with the heighest height in the row
    nextY = generateTableRow(
      doc,
      table.headers,
      row,
      colWidth,
      padding,
      firstColWidth,
      xPositions,
      nextY
    );

    // update nextY to account for potential lack of space
    // in the page
    nextY = getNextYWrapper(nextY);
  });

  return nextY;
}

/**
 * This function creates an saves a PDF with the
 * content specified by the parameters
 * @param tables tables to add to the PDF
 * @param title title of the PDF
 * @param filename file name to save the PDF as
 */
function pdf(tables: Table[], title: string, filename: string) {
  // create JsPDF a4 document in landscape
  const doc = new JsPDF({
    orientation: "l",
    unit: "pt",
    format: "a4",
  });

  // set the fonts for the various categories of text
  const titleFontSize = 14;
  const tableTitleFontSize = 12;
  const sectFontSize = 10;
  const textFontSize = 8;

  // Get the page total pt height and pt width based on
  // https://github.com/MrRio/jsPDF/blob/ddbfc0f0250ca908f8061a72fa057116b7613e78/jspdf.js#L59
  // because we are in landscape mode
  // the width x height values are flipped to reflect this
  const pageDimensions = {
    height: 595.28,
    width: 841.89,
  };

  // Set some general margin to the document
  const pageMargin = 50;

  // The live area of a document represents the
  // area of the page that will contain content
  // It needs to take into account the margin
  const liveArea = {
    width: pageDimensions.width - pageMargin,
    height: pageDimensions.height - pageMargin,
  };

  // this is some padding that will be used between elements added
  const padding = 15;

  // this is an DocProps object that makes passing
  // the properties we set more easily
  const docProps = {
    padding,
    liveArea,
    pageMargin,
  };

  // the first line of the document can start after the margin
  // so the next y value used to add an element will be equal to the
  // page margin
  let nextY = pageMargin;

  // we add the title to the document and get the y value
  // for the next element
  nextY = generateText(doc, title, docProps, titleFontSize, nextY, "bold") + 10;

  // get generate each table and get the next y value
  tables.forEach((table) => {
    nextY =
      addTable(
        doc,
        table,
        docProps,
        nextY,
        textFontSize,
        sectFontSize,
        tableTitleFontSize
      ) + 20;
  });

  // we call the function to download the pdf
  doc.save(filename);
}

/**
 * This function creates a PDF containing the recommendations for a
 * completed assessment and its checkpoints for each area with the answers given
 * @param assessment assessment object a completed assessment
 */
export default async function createPDF(assessment: AssessmentAPP) {
  // we set the name we want to download the file as
  const filename = `Feedback-${assessment.id}.pdf`;

  // we set the headers of the recommendation and checkpoint tables
  const recsHeaders = ["Priority", "Recommendation", "Additional Info"];
  const checkpointHeaders = ["Order", "Description", "Topics", "Answer"];

  // initialize the list of tables to add to the document
  // in the end, there should be one of recommendations
  // and one for each checkpoint area
  const tables: Table[] = [];

  // get the template information, this is necessary to print the
  // template information for the assessment
  const templateInfo = await getTemplate(Number(assessment.templateId));

  // get the list of areas, answers, and topics of the template
  // that the assessment was created from
  const areas = await getAreas(Number(templateInfo.id));
  const answerList = await getAnswers(Number(templateInfo.id));
  const topics = await getTopics(Number(templateInfo.id));

  // save template information and assessor feedback into variables
  const feedback = templateInfo.information;
  const assessorFeedback = assessment.feedbackText;

  // get recommendations generated based on the answers given in the assessment
  const recs = await getTopicRecommendations(Number(assessment.id), undefined);

  // generate and save recommendations table into the tables variable
  tables.push(getRecTable(recs, recsHeaders, feedback, assessorFeedback));

  // get answers given by users
  const checkpointAnswers = await getAnswerDictionary(Number(assessment.id));

  // generate tables related to each area
  // and add to tables variable
  (
    await getAreaTables(
      areas,
      checkpointHeaders,
      checkpointAnswers,
      answerList,
      topics
    )
  ).forEach((s) => tables.push(s));

  // call function to create and save pdf based on tables created
  pdf(tables, `Feedback for evaluation ${assessment.id}`, filename);
}
