import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Chart,
  ArcElement,
  CategoryScale,
  RadialLinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  CategoryAPP,
  useGetCategories,
} from "../../../api/CategoryAPI/CategoryAPI";
import {
  MaturityAPP,
  useGetMaturities,
} from "../../../api/MaturityAPI/MaturityAPI";
import { ScoreAPP, useGetScores } from "../../../api/ScoreAPI/ScoreAPI";
import { TopicAPP, useGetTopics } from "../../../api/TopicAPI/TopicAPI";
import ErrorPopup, { getOnError, RefObject } from "../../ErrorPopup/ErrorPopup";
/**
 * use the Chart.js libraries and properties from www.chartjs.org
 */
Chart.register(ArcElement, CategoryScale, RadialLinearScale, Legend, Tooltip);
// define type that contains ids of assessment + template
type ProgressEvaluationCardProps = {
  assessmentId: number;
  templateId: number;
};
/**
 * apply filter for category or maturity
 */
type Filter = "Category" | "Maturity";

export default function ProgressEvaluationCard({
  assessmentId,
  templateId,
}: ProgressEvaluationCardProps) {
  /**
   * Ref for error popup
   */
  const refErrorProgress = useRef<RefObject>(null);
  const onErrorProgress = getOnError(refErrorProgress);
  /**
   * define topics, categories, maturities, scores etc as contstants using the React usestate hook
   */
  const [topics, setTopics] = useState<TopicAPP[]>();
  const [categories, setCategories] = useState<CategoryAPP[]>();
  const [maturities, setMaturities] = useState<MaturityAPP[]>();
  const [scores, setScores] = useState<ScoreAPP[]>();
  const [topicSelected, setTopicSelected] = useState<number | undefined>(
    undefined
  );
  const [filter, setFilter] = useState<Filter>();
  const [filterSelected, setFilterSelected] = useState<number | null>();
  /**
   * constant delcaration for getting the topics
   */
  const { status: statusTopics, data: dataTopics } = useGetTopics(
    templateId,
    true,
    onErrorProgress
  );
  /**
   * constant declaration for getting the categories
   */
  const { status: statusCategories, data: dataCategories } = useGetCategories(
    templateId,
    true,
    onErrorProgress
  );
  /**
   * constant declaration for getting the maturitylevels
   */
  const { status: statusMaturities, data: dataMaturities } = useGetMaturities(
    templateId,
    true,
    onErrorProgress
  );
  /**
   * constant declaration for getting the scores
   */
  const { status: statusScores, data: dataScores } = useGetScores(
    assessmentId,
    topicSelected,
    onErrorProgress
  );
  /**
   * using useEffect hooks from React in order to prevent writing a class
   */
  useEffect(() => {
    setFilter("Category");
    setFilterSelected(null);
  }, []);
  useEffect(() => {
    if (statusTopics === "success") {
      setTopics(dataTopics);
    }
  }, [statusTopics, dataTopics]);
  useEffect(() => {
    if (statusCategories === "success") {
      setCategories(dataCategories);
    }
  }, [statusCategories, dataCategories]);
  useEffect(() => {
    if (statusMaturities === "success") {
      setMaturities(dataMaturities);
    }
  }, [statusMaturities, dataMaturities]);
  useEffect(() => {
    if (statusScores === "success") {
      setScores(dataScores);
    }
  }, [statusScores, dataScores]);
  /**
   * use handletopicchange constant to define an event handler
   * w.r.t. changing topics
   */
  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value !== "-")
      setTopicSelected(Number(event.target.value));
    else setTopicSelected(undefined);
  };
  /**
   * use handlecategorychange constant to define an event handler
   * w.r.t changing category
   */
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value !== "total")
      setFilterSelected(Number(event.target.value));
    else setFilterSelected(null);
  };
  if (
    !(
      scores &&
      maturities &&
      categories &&
      filter &&
      filterSelected !== undefined
    )
  ) {
    return <>...</>;
  }
  /**
   * constant declarations for filtered
   * and the displayed objects
   */
  const filteredObjects = filter === "Category" ? categories : maturities;
  const displayedObjects = filter === "Category" ? maturities : categories;
  /**
   * constant declarations for the corresponding id's of the filters
   * and the displayed ones
   */
  const filteredId = filter === "Category" ? "categoryId" : "maturityId";
  const displayedId = filter === "Category" ? "maturityId" : "categoryId";
  /**
   * constant declaration for handling the changing of the filters
   */
  const handleFilterChange = () => {
    if (filter === "Category") {
      setFilter("Maturity");
      setFilterSelected(null);
    } else {
      setFilter("Category");
      setFilterSelected(null);
    }
  };
  /**
   * constant declaration to get the scores in an array
   */
  const getFilteredScores = () =>
    scores.filter(
      (score: ScoreAPP) =>
        score[filteredId] === filterSelected &&
        score[displayedId] !== null &&
        score.score !== -1
    ) as ScoreAPP[];
  /**
   * constant declaration to get the labels
   */
  const getLabels = () =>
    getFilteredScores().map((score: ScoreAPP) => {
      const displayedObject = displayedObjects.find(
        (o) => o.id === score[displayedId]
      );
      if (displayedObject) {
        return displayedObject.name;
      }
      return "";
    });
  /**
   * constant declaration to get the score data
   */
  const getData = () =>
    getFilteredScores().map((score: ScoreAPP) => score.score);
  /**
   * Apply the conditional colouring in the scores, e.g. 0%=red and 100% is green,
   * so once the score gets higher the colour changes accordingly
   */
  const getBackgroundColor = () =>
    getFilteredScores().map(
      (score: ScoreAPP) =>
        `rgba(${Math.floor((255 / 100) * (100 - score.score))},${Math.floor(
          (255 / 100) * score.score
        )},0,0.4)`
    );
  /**
   * scale the polar area chart in such a way
   * the values are between 0 and 100
   */
  const options = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };
  /**
   * return the progressevaluationcard in which the polar area chart is at the right side,
   * and on the left side you see the scores for e.g. the maturity levels and the dropdown menus for topics and areas
   * with a vertical line that seperates the polar area chart with the scores , for readability purposes
   */
  return (
    <Card
      sx={{
        display: "flex",
        verticalAlign: "middle",
        width: "inherit",
        borderRadius: "20px",
        marginBottom: "10px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          verticalAlign: "middle",
          width: "inherit",
          borderRadius: "20px",
          marginBottom: "10px",
        }}
      >
        <Box width="50vw" height="50vw" bgcolor="white">
          <CardContent>
            <Stack direction="column">
              <Box width="15vw">
                <h2>View Topic</h2>
                {topics && (
                  <Select
                    value={topicSelected ? topicSelected.toString() : "-"}
                    onChange={handleTopicChange}
                  >
                    {[
                      <MenuItem key="menu-no-topic" value="-">
                        -
                      </MenuItem>,
                      topics.map((topic) => (
                        <MenuItem
                          key={`menu-topic-${topic.id}`}
                          value={topic.id.toString()}
                        >
                          {topic.name}
                        </MenuItem>
                      )),
                    ]}
                  </Select>
                )}
              </Box>
              <Box width="15vw">
                <h2>View</h2>
                <RadioGroup
                  sx={{
                    width: "inherit",
                    marginTop: "5px",
                    flexWrap: "nowrap",
                  }}
                  name="switch-filter"
                  value={filter === "Category"}
                  onClick={handleFilterChange}
                  row
                >
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    label="Area"
                    value
                  />
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    label="Maturity"
                    value={false}
                  />
                </RadioGroup>
                <Select
                  value={
                    filterSelected === null
                      ? "total"
                      : filterSelected.toString()
                  }
                  onChange={handleCategoryChange}
                >
                  <MenuItem key="menu-total-category" value="total">
                    Total
                  </MenuItem>
                  ,
                  {filteredObjects.map((o) => (
                    <MenuItem key={o.name} value={o.id.toString()}>
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Stack>
            <Box width="inherit">
              <br />
              <Divider textAlign="left" />
              <br />
            </Box>
            <Box>
              {getFilteredScores().map((score: ScoreAPP) => {
                const displayedObject = displayedObjects.find(
                  (o) => o.id === score[displayedId]
                );

                if (displayedObject) {
                  return (
                    <p key={displayedObject.id}>{`${
                      displayedObject.name
                    }: ${Math.round(score.score)}%`}</p>
                  );
                }
                return "";
              })}
            </Box>
            <Box width="inherit">
              <br />
              <Divider textAlign="left" />
              <br />
            </Box>
            <Box width="inherit">
              <h2>
                {scores
                  .filter(
                    (score: ScoreAPP) =>
                      score[filteredId] === filterSelected &&
                      score[displayedId] === null &&
                      score.score !== -1
                  )
                  .map(
                    (score: ScoreAPP) => `Total: ${Math.round(score.score)}%`
                  )}
                <br />
              </h2>
            </Box>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }} />
        </Box>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Box width="50vw" height="50vw" bgcolor="white">
          <CardContent>
            <PolarArea
              data={{
                labels: getLabels(),
                datasets: [
                  {
                    label: "Progress Scores",
                    data: getData(),
                    backgroundColor: getBackgroundColor(),
                  },
                ],
              }}
              options={options}
            />
          </CardContent>
        </Box>
      </CardContent>
      <ErrorPopup ref={refErrorProgress} />
    </Card>
  );
}
