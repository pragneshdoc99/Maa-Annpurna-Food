/* eslint-disable */

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  makeStyles,
  IconButton,
  Button
} from "@material-ui/core";
import NotListedLocationIcon from "@material-ui/icons/NotListedLocation";

const useStyles = makeStyles(theme => ({
  dialog: {
    height: "auto !important",
    width: "auto !important"
  },
  dialogTitle: {
    textAlign: "center"
  },
  dialogContent: {
    textAlign: "center"
  },
  dialogAction: {
    justifyContent: "center"
  },
  titleIcon: {
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.success.dark,
      cursor: "default"
    },
    "& .MuiSvgIcon-root": {
      fontSize: "8rem"
    }
  }
}));

export default function AlertDialog(props) {
  const { alertDialog, setAlertDialog } = props;
  const classes = useStyles();

  return (
    <Dialog open={alertDialog.isOpen} classes={{ paper: classes.dialog }}>
      <DialogTitle className={classes.dialogTitle}>
        <IconButton disableRipple className={classes.titleIcon}>
          <NotListedLocationIcon color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="subtitle1">{alertDialog.title}</Typography>
        <Typography variant="subtitle2">{alertDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button
          text="Okay"
          color="primary"
          variant="contained"
          onClick={() => setAlertDialog()}
        >
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}
