import * as React from "react"

import CloseIcon from "@mui/icons-material/Close"
import ReIssueLogTable from "../ReIssueLogTable"
import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function ReIssueLogDialog() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClickOpen}
        sx={{ fontWeight: "bold", border: "2px solid" }}
      >
        Check Re-Issue Log
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Re-Issue Log History
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              cancel
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 5 }}>
          <ReIssueLogTable />
        </Box>
      </Dialog>
    </React.Fragment>
  )
}
