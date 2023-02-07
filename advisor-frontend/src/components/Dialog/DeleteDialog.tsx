import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import React from "react";

/**
 * Interface to pass through the template delete API call
 */
export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  deleteTemplate: () => void;
}

/**
 *
 * @param props Contains the open prop, onClose prop and the deleteTemplate prop, which is the delete template handler
 * @returns A dialog that asks if a user wants to delete a template
 */
export default function DeleteDialog(props: SimpleDialogProps) {
  /**
   * Declare the props
   */
  const { onClose, open, deleteTemplate } = props;

  /**
   * A handler that takes care of only closing the dialog when pressed No
   */
  const handleClose = () => {
    onClose();
  };

  /**
   * A handler that takes care of deleting a template and closing the dialog when pressed Yes
   */
  const handleDeleteClose = () => {
    onClose();
    deleteTemplate();
  };

  /**
   * return a confirmation popup to make sure that an administrator gets a warning beforehand
   * for deleting templates, so for prevention purposes with buttons yes (on bottom left) and no (bottom right)
   */
  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open}>
      <DialogTitle> Delete</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={1}>
          <Grid item> Do you want to delete the template?</Grid>
          <Grid item>
            <Typography color="red">
              WARNING: This action cannot be undone
            </Typography>
          </Grid>

          <Grid item alignSelf="center">
            <Button
              variant="contained"
              sx={{
                marginRight: "2vw",
              }}
              onClick={handleDeleteClose}
            >
              Yes
            </Button>
            <Button variant="contained" onClick={handleClose}>
              No
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
