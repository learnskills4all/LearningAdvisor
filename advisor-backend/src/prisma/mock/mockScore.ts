export const aScore = {
  category_id: 1,
  maturity_id: 1,
  score: 1,
};

export const possibleAnswers = [
  {
    answer_id: 1,
    answer_weight: 100,
  },
  {
    answer_id: 2,
    answer_weight: 50,
  },
];

export const maturityIdsList = [1, 2];
export const categoryIdsList = [1, 2];

export const checkpoints = [
  {
    checkpoint_id: 1,
    maturity_id: 1,
    category_id: 1,
    weight: 3,
    CheckpointAndAnswersInAssessments: [
      {
        answer_id: 1,
        checkpoint_id: 1,
        assessment_id: 1,
      },
    ],
  },
  {
    checkpoint_id: 2,
    maturity_id: 2,
    category_id: 1,
    weight: 2,
    CheckpointAndAnswersInAssessments: [
      {
        answer_id: 1,
        checkpoint_id: 2,
        assessment_id: 1,
      },
    ],
  },
  {
    checkpoint_id: 3,
    maturity_id: 1,
    category_id: 2,
    weight: 1,
    CheckpointAndAnswersInAssessments: [
      {
        answer_id: 1,
        checkpoint_id: 3,
        assessment_id: 1,
      },
    ],
  },
  {
    checkpoint_id: 4,
    maturity_id: 2,
    category_id: 2,
    weight: 3,
    CheckpointAndAnswersInAssessments: [
      {
        answer_id: 2,
        checkpoint_id: 4,
        assessment_id: 1,
      },
    ],
  },
];

export const output = [
  {
    category_id: 1,
    maturity_id: 1,
    score: 100,
  },
  {
    category_id: 2,
    maturity_id: 1,
    score: 100,
  },
  {
    category_id: 1,
    maturity_id: 2,
    score: 100,
  },
  {
    category_id: 2,
    maturity_id: 2,
    score: 50,
  },
  {
    category_id: 1,
    maturity_id: null,
    score: 100,
  },
  {
    category_id: 2,
    maturity_id: null,
    score: 62.5,
  },
  {
    category_id: null,
    maturity_id: 1,
    score: 100,
  },
  {
    category_id: null,
    maturity_id: 2,
    score: 70,
  },
  {
    category_id: null,
    maturity_id: null,
    score: 83.33333333333334,
  },
];

export const possibleAnswers1 = [
  {
    answer_id: 1,
    answer_weight: 0,
  },
];

export const maturityIdsList1 = [1];
export const categoryIdsList1 = [1];

export const checkpoints1 = [
  {
    checkpoint_id: 1,
    maturity_id: 1,
    category_id: 1,
    weight: 0,
    CheckpointAndAnswersInAssessments: [
      {
        answer_id: 1,
        checkpoint_id: 1,
        assessment_id: 1,
      },
    ],
  },
];

export const output1 = [
  {
    category_id: 1,
    maturity_id: 1,
    score: -1,
  },
  {
    category_id: 1,
    maturity_id: null,
    score: -1,
  },
  {
    category_id: null,
    maturity_id: 1,
    score: -1,
  },
  {
    category_id: null,
    maturity_id: null,
    score: -1,
  },
];

export const checkpoints2 = [
  {
    checkpoint_id: 1,
    maturity_id: 1,
    category_id: 1,
    weight: 0,
    CheckpointAndAnswersInAssessments: [
      {
        answer_id: 2,
        checkpoint_id: 1,
        assessment_id: 1,
      },
    ],
  },
];
