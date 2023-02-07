import { Alert, Snackbar } from "@mui/material";
import { AxiosError } from "axios";
import { forwardRef, Ref, useImperativeHandle, useState } from "react";

/**
 * export referenceobject as an interface
 * containing the errorpopup handler
 */
export interface RefObject {
  handleErrorPopup: (msg: string) => void;
}

/**
 * Get onError function that uses ref
 * @param ref - Reference to the error handler
 * @returns onError function, which takes error and handles it
 */
export const getOnError = (ref: React.RefObject<RefObject>) => {
  const onError = (err: unknown) => {
    if (ref && ref.current) {
      if (err instanceof AxiosError) {
        const errorMessage = `${err.response?.data.error}: ${err.response?.data.message}`;
        ref.current.handleErrorPopup(errorMessage);
      } else if (err instanceof Error) {
        ref.current.handleErrorPopup(err.toString());
      } else if (typeof err === "string") {
        ref.current.handleErrorPopup(err);
      }
    }
  };

  return onError;
};

/**
 * constant declaration for errorpopup
 */
const ErrorPopup = forwardRef(
  // eslint-disable-next-line react/require-default-props
  (props: { isWarning?: boolean }, ref: Ref<RefObject>) => {
    /**
     * Use error states
     */
    const [errorPopup, setErrorPopup] = useState<{
      msg: string;
      open: boolean;
    }>({
      msg: "",
      open: false,
    });

    /**
     * constant declaration for errorpopup handling
     */
    const handleErrorPopup = (msg: string) =>
      setErrorPopup({ msg, open: true });

    /**
     * Handle error close
     */
    const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === "clickaway") {
        return;
      }

      /**
       * set error popup
       */
      setErrorPopup({ msg: "", open: false });
    };

    /**
     * Use imperative handle for parent class
     */
    useImperativeHandle(ref, () => ({ handleErrorPopup }));

    /**
     * Return the errorpopup at the bottom of the screen by means
     * of a snackbar component which provide brief notifications
     */
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={errorPopup.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={props.isWarning ? "warning" : "error"}
          sx={{ width: "100%" }}
        >
          {errorPopup.msg}
        </Alert>
      </Snackbar>
    );
  }
);

export default ErrorPopup;
