import {
  Theme,
  SelectChangeEvent,
  FormControl,
  Select,
  MenuItem,
  ThemeProvider,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { TopicAPP, useGetTopics } from "../../api/TopicAPI/TopicAPI";
import { RootState } from "../../app/store";
import INGTheme from "../../Theme";
import ErrorPopup, { getOnError, RefObject } from "../ErrorPopup/ErrorPopup";
import RecommendationGrid from "../Grids/Specific/Recommendation/RecommendationGrid";

/**
 * Returns dropdown menu for topic choice
 * and grid with recommendations related to specified topic
 */
function ListOfRecommendations({
  theme,
  assessmentId,
  templateId,
  completedAt,
}: {
  theme: Theme;
  assessmentId: number;
  templateId: number;
  completedAt: string;
}) {
  const { userRole } = useSelector((state: RootState) => state.userData);

  /**
   * Ref for error popup
   */
  const refErrorRecommendations = useRef<RefObject>(null);
  const onErrorRecommendations = getOnError(refErrorRecommendations);

  /**
   * Fetch the GetTopics API
   */
  const { status, data } = useGetTopics(
    templateId,
    undefined,
    onErrorRecommendations
  );

  const [topicList, setTopicList] = useState<TopicAPP[]>();

  const [topic, setTopic] = useState<number>();

  /**
   * constant declaration that handles the changing of topics
   */
  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value !== "-") setTopic(Number(event.target.value));
    else setTopic(undefined);
  };

  /**
   * first render: get the area list and set the area
   */
  React.useEffect(() => {
    if (status === "success") {
      setTopicList(data);
    }
  }, [status]);

  return (
    <div
      style={{ width: "inherit", display: "contents" }}
      data-testid="recommendationTest"
    >
      <ThemeProvider theme={INGTheme}>
        {topicList !== undefined && (
          <FormControl sx={{ width: "inherit" }}>
            <Select
              value={topic ? topic.toString() : "-"}
              onChange={handleTopicChange}
            >
              {[
                <MenuItem key="menu-no-topic" value="-">
                  No topic prioritization
                </MenuItem>,
                ...topicList.map((t) => (
                  <MenuItem key={`menu-topic-${t.id}`} value={t.id.toString()}>
                    {t.name}
                  </MenuItem>
                )),
              ]}
            </Select>
          </FormControl>
        )}
        <RecommendationGrid
          theme={theme}
          assessmentId={assessmentId}
          topicId={topic}
          isEditable={userRole === "ASSESSOR" && completedAt !== null}
        />
        <ErrorPopup ref={refErrorRecommendations} />
      </ThemeProvider>
    </div>
  );
}

export default ListOfRecommendations;
