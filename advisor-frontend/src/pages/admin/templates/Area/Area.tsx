// import { useParams } from "react-router-dom";
import { Theme, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SubareaGrid from "../../../../components/Grids/Specific/Subarea/SubareaGrid";
import userType from "../../../../components/Sidebar/listUsersTypes";
import PageLayout from "../../../PageLayout";
import CheckpointGrid from "../../../../components/Grids/Specific/Checkpoint/CheckpointGrid";
import {
  CategoryAPP,
  useGetCategory,
} from "../../../../api/CategoryAPI/CategoryAPI";
import { getUpdatedTheme } from "./colorHelpers";

/**
 * Page with details regarding an area beloging to a certain template
 * This should only be accessible to admins
 *
 * The id's of templates, area are defined
 * followed by usestatehooks for the color, theme and areainfo
 * supported from React
 */
function Area({ theme }: { theme: Theme }) {
  const { templateId } = useParams();
  const { areaId } = useParams();

  const [areaInfo, setAreaInfo] = useState<CategoryAPP>();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [primaryColor, setPrimaryColor] = useState(theme.palette.primary.main);

  const areaResponse = useGetCategory(Number(areaId));
  /**
   * react useEffect hooks,
   * so no classes have to be written
   */
  React.useEffect(() => {
    if (areaResponse.data && areaResponse.status === "success") {
      setAreaInfo(areaResponse.data);
      const { color } = areaResponse.data;
      const newTheme = getUpdatedTheme(color, theme);
      setPrimaryColor(color);
      setCurrentTheme(newTheme);
    }
  }, [areaResponse]);

  return (
    <div data-testid="areaTest">
      {areaInfo && (
        <PageLayout
          title={`${areaInfo.name}`}
          sidebarType={userType.ADMIN}
          headerColor={primaryColor}
        >
          <ThemeProvider theme={currentTheme}>
            <h2>Subareas</h2>
            <SubareaGrid theme={currentTheme} categoryId={Number(areaId)} />
            <h2>Checkpoints</h2>
            <CheckpointGrid
              theme={currentTheme}
              templateId={Number(templateId)}
              categoryId={Number(areaId)}
            />
          </ThemeProvider>
        </PageLayout>
      )}
    </div>
  );
}

export default Area;
