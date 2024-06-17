/* eslint-disable */

import React, { useState, useEffect } from "react";
import firebase from '../../../../firebase';
import clsx from "clsx";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green, pink } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import Page from "../../../page";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AlertDialog from "../../../../popup/AlertDialog";
// import ConfirmDialog from "./ConfirmDialog";
// import moment from "moment";
// import { useTranslation } from "react-i18next";
// import logoImg from "../images/cyberLogo.png";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  makeStyles,
  Typography,
  Slide,
  Snackbar,
  Container,
  Chip,
  Divider,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ScratchListTable from "./ScratchListTable";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
  },
  formControl: {
    width: "100%",
    variant: "outlined",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  tab: {
    flexGrow: 1,
  },
  avatarimage: {
    display: "flex",
    justifyContent: "center",
    margin: "20px",
    padding: "10px",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },

  green: {
    color: "#fff",
    backgroundColor: green[500],
    margin: "10px",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  textarea: {
    resize: "both",
  },
}));

const outerTheme = createMuiTheme({
  palette: {
    secondary: {
      main: "#ffffff",
    },
  },
});

const gridStyles = {
  paddingBottom: 5,
  paddingRight: 5,
  marginTop: 5,
  marginLeft: "auto",
  marginRight: "auto",
};

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")`
  width: 300px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;
const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Listbox = styled("ul")`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

const AddScratch = ({
  currentUserId,
  viweOnly,
  className,
  redirectBack,
  dataDetails,
  ...rest
}) => {
  // const { t } = useTranslation();
  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState("1");
  const [spin, setSpin] = useState(false);
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [backPage, setBackPage] = useState(true);
  const [values, setValues] = useState({
    fromAmmount: 0,
    toAmmount: 0,
    discountPersent: 0
  });

  const handleTabChange = (event, newValue) => {
    // console.log("VALUE :: ", newValue);
    setTabValue(newValue);
  };

  const setAlertDialogfunc = () => {
    setAlertDialog({
      ...alertDialog,
      isOpen: false,
      title: "",
      subTitle: "",
    });
  };

  useEffect(() => {

    if (currentUserId) {
      // console.log("currentUserId :: ", dataDetails);


      setValues({
        ...values,
        fromAmmount: dataDetails.fromAmmount,
        toAmmount: dataDetails.toAmmount,
        discountPersent: dataDetails.discountPersent
      })

    }
  }, []);

  const handleBlur = (event) => {
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    //console.log('caseDetails', values)
  };



  function redirectBackPage(backToLoad) {
    setBackPage(backToLoad);
  }

  function onBacktoHome(e) {
    if (!currentUserId) {
    }
    const backValue = false;
    redirectBackPage(backValue);
  }

  // ------------Multipale select-----------------
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [state, setState] = React.useState({
    open: false,
  });
  const { open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

  const onUpdateDetails = () => {
    setSpin(true);

    let tmpUserId = localStorage.getItem('userId');
    let tmpEmail = localStorage.getItem('email');

    if (!parseFloat(values.fromAmmount)) {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Enter From Ammmount.",
      });
    } else if (!parseFloat(values.toAmmount)) {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Enter To Ammount."
      })

    } else if (!parseFloat(values.discountPersent)) {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Enter discount (%) ."
      })

    } else {
      if (!currentUserId) {


        const detailObj = {
          userId: tmpUserId,
          userEmail: tmpEmail,
          fromAmmount: values.fromAmmount,
          toAmmount: values.toAmmount,
          discountPersent: values.discountPersent
        };

        // console.log("OBJ :: ", detailObj);

        let firestoreData = firebase.firestore();
        firestoreData.collection('scratch-list')
          .where('fromAmmount', '==', values.fromAmmount)
          .where('toAmmount', '==', values.toAmmount)
          .where('discountPersent', '==', values.discountPersent)
          .get().then((querySnapshot) => {
            if (querySnapshot.empty) {
              // Email doesn't exist, add the document
              firestoreData.collection("scratch-list").add(detailObj).then((docRef) => {

                setValues({
                  ...values,
                  fromAmmount: 0,
                  toAmmount: 0,
                  discountPersent: 0,
                })

                setSpin(false);

                setAlertDialog({
                  isOpen: true,
                  title: "Scratch Card added successfully",
                });

                setBackPage(false);


              }).catch(error => {
                alert("Error is ", error);
              })
            } else {

              setSpin(false);

              setAlertDialog({
                isOpen: true,
                title: "Scratch Card already exists.",
              });
            }
          })
          .catch((error) => {
            console.error('Error checking email:', error);
          });
      } else {

        const detailObj = {
          userId: tmpUserId,
          userEmail: tmpEmail,
          fromAmmount: values.fromAmmount,
          toAmmount: values.toAmmount,
          discountPersent: values.discountPersent
        };

        // console.log("currentUserId :: ", currentUserId);
        // console.log("OBJ :: ", detailObj);

        let firestoreData = firebase.firestore();
        firestoreData.collection("scratch-list").doc(currentUserId).update(detailObj).then(() => {
          // alert("User Status Updated !");
          setValues({
            ...values,
            fromAmmount: 0,
            toAmmount: 0,
            discountPersent: 0
          })

          setSpin(false);
          setAlertDialog({
            isOpen: true,
            title: "Scratch Card update successfully",
          });

          setBackPage(false);

        })
      }
    }
  };

  return (
    <div>
      {backPage && (
        <Page className={classes.root} title={"Scratch Card Form"}>
          <Container maxWidth={false}>
            <form
              autoComplete="off"
              noValidate
              className={clsx(classes.root, className)}
              {...rest}
            >
              <Box display="flex" style={{ alignItems: "center" }}>
                <ArrowBackIcon
                  color="primary"
                  variant="contained"
                  onClick={() => onBacktoHome()}
                  style={{ margin: "0px 16px", cursor: "pointer" }}
                />
                <Box flexGrow={1}>
                  <Typography variant="h4" className="txtleft">
                    {"Scratch Card Form"}
                  </Typography>
                </Box>
                {!viweOnly &&
                  (spin ? (
                    <CircularProgress
                      color="secondary"
                      style={{ margin: "5px" }}
                      size={20}
                    />
                  ) : (
                    ""
                  ))}
                {!viweOnly && (
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={spin}
                    onClick={() => { onUpdateDetails(); }}
                  >
                    <AddCircleIcon className={"btnRightDetails"} />
                    {currentUserId ? "Update" : "Add"}
                  </Button>
                )}
              </Box>
              <hr />
              <div className="overflowform">
                <Card style={{ minHeight: "500px", marginBottom: "20px" }}>
                  <CardContent>
                    <div className={classes.tab}>
                      <TabContext value={tabValue}>
                        <AppBar position="static">
                          <ThemeProvider theme={outerTheme}>
                            <TabList
                              onChange={handleTabChange}
                              aria-label={"profiletab"}
                              variant="scrollable"
                              scrollButtons="on"
                            >
                              <Tab label={"Details"} value="1" />
                            </TabList>
                          </ThemeProvider>
                        </AppBar>

                        <TabPanel value="1">
                          <Grid container spacing={3}>
                            <Grid item md={3} xs={12}>
                              <TextField
                                fullWidth
                                label={"From Price"}
                                name="fromAmmount"
                                value={values.fromAmmount}
                                onChange={handleChange}
                                required
                                disabled={viweOnly}
                                variant="outlined"
                                type="number"
                              />
                            </Grid>
                            <Grid item md={3} xs={12}>
                              <TextField
                                fullWidth
                                label={"To Price"}
                                name="toAmmount"
                                value={values.toAmmount}
                                onChange={handleChange}
                                required
                                disabled={viweOnly}
                                variant="outlined"
                                type="number"
                              />
                            </Grid>

                            <Grid item md={3} xs={12}>
                              <TextField
                                fullWidth
                                label={"Discount (%)"}
                                name="discountPersent"
                                value={values.discountPersent}
                                onChange={handleChange}
                                required
                                disabled={viweOnly}
                                variant="outlined"
                                type="number"
                              />
                            </Grid>



                          </Grid>

                        </TabPanel>
                      </TabContext>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
            <AlertDialog
              alertDialog={alertDialog}
              setAlertDialog={setAlertDialogfunc}
            />

            {/* <ConfirmDialog
              confirmDialog={confirmDialog}
              setConfirmDialog={setConfirmDialog}
            /> */}

            <Snackbar
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={open}
              TransitionComponent={TransitionUp}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              <Alert severity="error">
                {"Please fill all required field."}
              </Alert>
            </Snackbar>
          </Container>

        </Page>
      )}
      {!backPage && <ScratchListTable />}
    </div>
  );
};

AddScratch.propTypes = {
  className: PropTypes.string,
};

export default AddScratch;
