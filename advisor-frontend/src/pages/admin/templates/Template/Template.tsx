// import { useParams } from "react-router-dom";
import React, { useState } from "react";
import { FormControlLabel, Radio, RadioGroup, Theme } from "@mui/material";
import { useParams } from "react-router-dom";
import AnswerGrid from "../../../../components/Grids/Specific/Answer/AnswerGrid";
import CategoryGrid from "../../../../components/Grids/Specific/Category/CategoryGrid";
import MaturityGrid from "../../../../components/Grids/Specific/Maturity/MaturityGrid";
import TopicGrid from "../../../../components/Grids/Specific/Topic/TopicGrid";
import userType from "../../../../components/Sidebar/listUsersTypes";
import TextfieldEdit from "../../../../components/TextfieldEdit/TextfieldEdit";
import PageLayout from "../../../PageLayout";
import TextfieldEditWeight from "../../../../components/TextfieldEditWeight/TextfieldEditWeight";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../../components/ErrorPopup/ErrorPopup";
import {
  usePatchTemplate,
  TemplateAPP,
  useGetTemplate,
} from "../../../../api/TemplateAPI/TemplateAPI";
/**
 *
 * Page with details regarding a certain template
 * This should only be accessible to admins
 * @param theme passes through the theming of the admin page, such as color, text and size
 * @return Template page, which has the features to adjust and customize a template
 */
function Template({ theme }: { theme: Theme }) {
  // Declare the templateId
  const { templateId } = useParams();

  // Statehook to store the template info in
  const [templateInfo, setTemplateInfo] = useState<TemplateAPP>();

  // Fetch the template data from the API
  const { status, data } = useGetTemplate(Number(templateId));

  // Statehook to store the weight values
  const [minWeight, setMinWeight] = useState<number>();
  const [maxWeight, setMaxWeight] = useState<number>();

  // Statehook to store a boolean for when the weights are invalid
  const [weightError, setWeightError] = useState(false);

  // Ref for error popup
  const refErrorTemplate = React.useRef<RefObject>(null);
  const onErrorTemplate = getOnError(refErrorTemplate);

  // Check if there is an template active and warn when there is not, called at first render
  React.useEffect(() => {
    onErrorTemplate(
      "Warning: Editing templates will influence evaluations that use these templates."
    );
  }, []);

  // Call to set the weights, everytime the status of the API changes.
  React.useEffect(() => {
    if (status === "success") {
      setTemplateInfo(data);
      setMinWeight(data.weightRangeMin);
      setMaxWeight(data.weightRangeMax);
    }
  }, [status]);

  // API hook call, used to avoid hook-in-hook error
  const patchTemplate = usePatchTemplate();

  // API call to change the template data
  const changeInfoOptimistic = (newInfo: TemplateAPP, weight?: boolean) => {
    const oldInfo = templateInfo;
    setTemplateInfo(newInfo);
    // Directly call the API
    patchTemplate.mutate(newInfo, {
      onSuccess: (info) => {
        // Check if the weights are valid to be changed
        if (
          info.weightRangeMin === minWeight &&
          info.weightRangeMax === maxWeight
        ) {
          setWeightError(false);
        }
      },
      onError: (error: unknown) => {
        onErrorTemplate(error);
        setTemplateInfo(oldInfo);
        // If the set weights are invalid, throw an error popup
        if (weight) {
          setWeightError(true);
        }
      },
    });
  };
  /**
   * Change weight function,
   * which will update the set weights into the database.
   */
  const changeWeights = () => {
    if (templateInfo && maxWeight && minWeight) {
      const newInfo = {
        ...templateInfo,
        weightRangeMin: minWeight,
        weightRangeMax: maxWeight,
      };
      changeInfoOptimistic(newInfo, true);
    }
  };

  /**
   * Change and update the weights,
   * everytime the user changes the weights. Called on weight change
   */
  React.useEffect(() => {
    changeWeights();
  }, [minWeight, minWeight]);

  return (
    <div data-testid="templateTest">
      {templateInfo && (
        <PageLayout
          title={`Template "${templateInfo.name}"`}
          sidebarType={userType.ADMIN}
        >
          <h2> Feedback Information Textbox </h2>
          <p style={{ margin: "0px" }}>
            This is the automated textfield that appears at the top of every
            assessment. It might contain an explanation of the recommendations
            list as well as some notes or tips for the person reviewing their
            feedback.
          </p>
          {/* Textfield box where the admin can write additional text to clarify the template */}
          <TextfieldEdit
            rows={5}
            theme={theme}
            text={templateInfo.information}
            handleSave={(intermediateStringValue) =>
              changeInfoOptimistic({
                ...templateInfo,
                information: intermediateStringValue,
              })
            }
          />
          {/* Define the grids for each component */}
          <h2> Areas </h2>
          <p style={{ margin: "0px" }}>
            To view, edit, add, or delete subareas and checkpoints belonging to
            an area, click on the arrow button.
          </p>
          <CategoryGrid theme={theme} templateId={Number(templateId)} />

          <h2>Topics </h2>
          <TopicGrid theme={theme} templateId={Number(templateId)} />

          <h2> Maturity Levels </h2>
          <MaturityGrid theme={theme} templateId={Number(templateId)} />
          {/* Section to alter the weight range for the checkpoints in the template */}
          <h2> Weight Range </h2>
          <div
            style={{
              width: "inherit",
              display: "inline-grid",
              gridTemplateColumns: "repeat(2, 250px [col-start])",
              rowGap: "10px",
            }}
          >
            <div>Start</div>
            <div>End</div>
            {minWeight && (
              <TextfieldEditWeight
                theme={theme}
                weightValue={minWeight}
                setWeight={setMinWeight}
                error={weightError}
              />
            )}
            {maxWeight && (
              <TextfieldEditWeight
                theme={theme}
                weightValue={maxWeight}
                setWeight={setMaxWeight}
                error={weightError}
              />
            )}
          </div>
          {/* Section where the admin can enable/disable the N/A option */}
          <h2> Checkpoint Values </h2>
          <div style={{ width: "inherit" }}>
            Include N/A
            <RadioGroup
              sx={{
                width: "inherit",
                marginTop: "5px",
              }}
              name="allowna"
              aria-labelledby="allowna-checkpoints"
              value={templateInfo.includeNoAnswer}
              onClick={() =>
                changeInfoOptimistic({
                  ...templateInfo,
                  includeNoAnswer: !templateInfo.includeNoAnswer,
                })
              }
              row
            >
              <FormControlLabel
                control={<Radio color="primary" />}
                label="Yes"
                value
              />

              <FormControlLabel
                control={<Radio color="primary" />}
                label="No"
                value={false}
              />
            </RadioGroup>
          </div>
          <AnswerGrid theme={theme} templateId={Number(templateId)} />
        </PageLayout>
      )}
      {/* Define the error popup, which will be rendered in case the API returns an error */}
      <ErrorPopup ref={refErrorTemplate} isWarning />
    </div>
  );
}

export default Template;
