import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Slide,
  Divider,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { showInfoToast } from "../../utils/toastUtils";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ConfirmDialog = ({
  title,
  text,
  open,
  setOpen,
  onSubmit,
  actionData,
  setActionData,
}) => {
  const handleClose = () => {
    setOpen(false);
    showInfoToast("Confirmation cancelled!");
    setActionData(null);
  };

  const handleConfirm = async () => {
    await onSubmit(actionData);
  };

  return (
    <Dialog
      open={open}
      slots={{
        transition: Transition,
      }}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 2,
          },
          elevation: 6,
        },
      }}
    >
      <DialogTitle fontWeight="bold">{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText
          id="alert-dialog-slide-description"
          color="#000"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <HelpIcon color="warning" fontSize="large" /> {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="text.secondary">
          No
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="success">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
