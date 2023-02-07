import * as React from "react";
import { UseMutationResult, UseQueryResult } from "react-query";
import { GridActionsCellItem, GridColumns, GridRowId } from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import GenericGrid from "../../Generic/GenericGrid";
import { AssessmentType } from "../../../../types/AssessmentType";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import {
  TemplateAPP,
  useDeleteTemplate,
  useDuplicateTemplate,
  usePatchTemplate,
  usePostTemplate,
} from "../../../../api/TemplateAPI/TemplateAPI";
import {
  handleAdd,
  handleDelete,
  handleDuplicate,
  handleInit,
  processRowUpdate,
} from "../../functions/handlers/handlers";
import DeleteDialog from "../../../Dialog/DeleteDialog";

type TemplateGridProps = {
  theme: Theme;
  templateType: AssessmentType;
  templateResponse: UseQueryResult<TemplateAPP[], unknown>;
  setTemplates: React.Dispatch<React.SetStateAction<TemplateAPP[]>>;
  activeTemplate?: String | undefined;
};

/**
 * Grid for templates
 * Uses theme, templateType, templateResponse, setTemplates
 */
export default function TemplateGrid({
  theme,
  templateType,
  templateResponse,
  setTemplates,
  activeTemplate,
}: TemplateGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<TemplateAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorTemplate = React.useRef<RefObject>(null);
  const onErrorTemplate = getOnError(refErrorTemplate);

  /**
   * Template mutations
   * Patch template
   * Post template
   * Delete template
   * Duplicate template
   */
  const patchTemplate = usePatchTemplate(onErrorTemplate);
  const postTemplate = usePostTemplate(templateType, onErrorTemplate);
  const deleteTemplate = useDeleteTemplate(onErrorTemplate);
  const duplicateTemplate = useDuplicateTemplate(onErrorTemplate);

  /**
   * useEffect for initialization of rows
   * Called when "status" of templates query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, templateResponse.status, templateResponse.data);
  }, [templateResponse.status, templateResponse.data]);

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: TemplateAPP, oldRow: TemplateAPP) => {
      processRowUpdate(
        setRows,
        patchTemplate as UseMutationResult,
        newRow,
        oldRow
      );
      setTemplates((templates) =>
        templates.map((t) => {
          const newT = t;
          if (t.id === oldRow.id) {
            newT.name = newRow.name;
          }
          return newT;
        })
      );
    },
    []
  );

  /**
   * Row delete handler
   * Called when the "Delete" action is pressed in the menu
   */
  const handleDeleteDecorator = React.useCallback(
    (rowId: GridRowId) => () => {
      handleDelete(
        setRows,
        deleteTemplate as UseMutationResult,
        rowId as number,
        templateResponse
      );
    },
    []
  );

  /**
   * Row duplicate handler
   * Called when the "Duplicate" action is pressed in the menu
   */
  const handleDuplicateDecorator = React.useCallback(
    (rowId: GridRowId) => () => {
      handleDuplicate(
        setRows,
        duplicateTemplate as UseMutationResult,
        rowId as number,
        templateResponse
      );
    },
    []
  );

  /**
   * Row add handler
   * Called when the "Add" button is pressed below the grid
   */
  const handleAddDecorator = React.useCallback(() => {
    handleAdd(setRows, postTemplate as UseMutationResult, templateResponse);
  }, []);

  /**
   * Delete dialog handler
   */
  const [open, setOpen] = React.useState(false);
  const [paramId, setParamId] = React.useState<GridRowId>(0);
  function handleClickOpen(id: GridRowId) {
    setOpen(true);
    setParamId(id);
  }
  const handleClose = () => {
    setOpen(false);
  };


  // function handleSetActive(id: GridRowId) {
  //   console.log(id);
  // }

  const columns = React.useMemo<GridColumns<TemplateAPP>>(
    () => [
      {
        field: "enabled",
        headerName: "Active",
        type: "boolean",
        flex: 1,
        editable: true,
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 1,
        editable: true,
      },
      {
        field: "description",
        headerName: "Description",
        type: "string",
        flex: 1,
        editable: true,
      },
      {
        field: "Actions",
        type: "actions",
        width: 100,
        getActions: (params: { id: GridRowId }) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Visit">
                <Link
                  to={`/admin/templates/${params.id}`}
                  data-testid={`template-${params.id}`}
                >
                  <ArrowForwardIcon className="arrowIcon" />
                </Link>
              </Tooltip>
            }
            label="Visit"
          />,
          <GridActionsCellItem
            icon={<FileCopyIcon />}
            label="Duplicate"
            onClick={handleDuplicateDecorator(params.id)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleClickOpen(params.id)}
            showInMenu
          />,
        ],
      },
    ],
    [handleDuplicateDecorator, handleDeleteDecorator]
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdateDecorator}
        hasToolbar
        add={{
          text: `CREATE NEW ${templateType} EVALUATION TEMPLATE`,
          handler: handleAddDecorator,
        }}
      />
      <ErrorPopup ref={refErrorTemplate} />
      <DeleteDialog
        open={open}
        onClose={handleClose}
        deleteTemplate={handleDeleteDecorator(paramId)}
      />
    </>
  );
}
