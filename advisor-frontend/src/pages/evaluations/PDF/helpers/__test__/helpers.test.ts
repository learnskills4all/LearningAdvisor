import * as helpers from "../pdfHelpers";

describe("Testing PDF helper function", () => {
  const checkpoint = {
    id: 1,
    description: "checkpoint one",
    additionalInfo: "additional info c1",
    weight: 3,
    order: 1,
    categoryId: 5,
    maturityId: 3,
    topics: [1],
    enabled: true,
  };
  const topic = {
    id: 1,
    name: "topic 1",
    templateId: 2,
    enabled: true,
  };

  const answers = {
    1: 3,
  };

  const answer = {
    id: 3,
    label: "yes",
    value: 3,
    templateId: 2,
    enabled: true,
  };

  const area = {
    id: 5,
    name: "An area",
    color: "#FFFFFF",
    order: 10,
    enabled: true,
    templateId: 2,
  };

  const subarea = {
    id: 7,
    name: "a",
    order: 1,
    description: "bla",
    summary: "b",
    categoryId: 5,
    enabled: true,
  };

  const checkpointAnswer = {
    id: checkpoint.id,
    description: checkpoint.description,
    order: checkpoint.order,
    topics: topic.name,
    answer: answer.label,
  };

  const rec = {
    id: 4,
    order: 1,
    description: "g",
    additionalInfo: "j",
  };

  const checkpointHeaders = ["Order", "Description", "Topics", "Answer"];
  const recsHeaders = ["Priority", "Recommendation", "Additional Info"];

  it("transform checkpoints for pdf functions", () => {
    expect(
      helpers.transformCheckpoints([checkpoint], answers, [answer], [topic])
    ).toStrictEqual([checkpointAnswer]);
  });

  it("transform area for pdf functions", () => {
    expect(
      helpers.transformArea(
        area,
        [subarea],
        [checkpointAnswer],
        checkpointHeaders
      )
    ).toStrictEqual({
      order: area.order,
      title: `Checkpoints: ${area.name}`,
      sections: [
        { title: subarea.name, text: [subarea.summary, subarea.description] },
      ],
      data: [
        [
          checkpointAnswer.order,
          checkpointAnswer.description,
          checkpointAnswer.topics,
          checkpointAnswer.answer,
        ],
      ],
      headers: checkpointHeaders,
    });
  });

  const feedback = "some feedback";
  const assessorFeedback = "assessor feedback";
  const assessorFeedbackSec = {
    title: "Facilitator Feedback",
    text: [assessorFeedback],
  };
  const feedbackSec = { title: "", text: [feedback] };

  const recObject = {
    title: `Recommendations`,
    data: [[rec.order, rec.description, rec.additionalInfo]],
    headers: recsHeaders,
  };

  it("get recs table with feedback and assessor feedback for pdf functions", () => {
    expect(
      helpers.getRecTable([rec], recsHeaders, feedback, assessorFeedback)
    ).toStrictEqual({
      ...recObject,
      sections: [feedbackSec, assessorFeedbackSec],
    });
  });

  it("get recs table with feedback and no assessor feedback for pdf functions", () => {
    expect(helpers.getRecTable([rec], recsHeaders, feedback, "")).toStrictEqual(
      {
        ...recObject,
        sections: [feedbackSec],
      }
    );
  });

  it("get recs table with no feedback and no assessor feedback for pdf functions", () => {
    expect(helpers.getRecTable([rec], recsHeaders, "", "")).toStrictEqual({
      ...recObject,
      sections: [],
    });
  });

  it("get recs table with no feedback and assessor feedback for pdf functions", () => {
    expect(
      helpers.getRecTable([rec], recsHeaders, "", assessorFeedback)
    ).toStrictEqual({
      ...recObject,
      sections: [assessorFeedbackSec],
    });
  });
});
