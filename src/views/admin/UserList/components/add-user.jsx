/* eslint-disable */
import React, { useState, useEffect } from "react";
import firebase  from '../../../../firebase';
import clsx from "clsx";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green, pink } from "@material-ui/core/colors";
import Page from "../../../page";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import UpdateIcon from "@material-ui/icons/Update";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import UserListTable from "./UserListTable";
import AlertDialog from "../../../../popup/AlertDialog";
// import ConfirmDialog from "./ConfirmDialog";

import {
  Box,
  Button,
  CardContent,
  Grid,
  TextField,
  makeStyles,
  Typography,
  Container,
} from "@material-ui/core";

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
  txtHiddenclass: {
    overflowY: "hidden",
  },
}));
// tab color
const outerTheme = createMuiTheme({
  palette: {
    secondary: {
      main: "#ffffff",
    },
  },
});


let firestoreData = firebase.firestore();

const AddUser = ({
  currentUserId,
  userData,
  className,
  ...rest
}) => {

  const [tabValue, setTabValue] = React.useState("1");
  const [spin, setSpin] = useState(false);
  const [isUpdateUserList, setIsUpdateUserList] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const handleTabChange = (event, newValue) => {
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
  const classes = useStyles();

  const [errorText, setErrorText] = useState("");
  const [mailerror, setMailError] = useState(false);

  const [values, setValues] = useState({
    department: "",
    numberIqama: "",
    caseType: "",
    password: "",
    altContactNo: "",
    contactNo: "",
    // email: "",
    role: "",
    subscriptionLevel: null,
    caseDescription: "",
    incidentDateTime: "",
    // dateofjoin: moment(new Date().getTime()).format("YYYY-MM-DDTHH:mm"),
    // dateofrelieving: moment(new Date().getTime()).format("YYYY-MM-DDTHH:mm"),
    incidentAddress: "",
    incidentState: "",
    incidentCity: "",
    incidentZipcode: 0,
    caseOpenDateTime: "",
    caseStatus: "",
    investigatingOfficer: "",
    officers: [],
    suspects: [],
    victims: [],
    evidenceCollection: [],
    closeNote: "",
    caseCloseDateTime: "",
    userImage: "",
    station: [],
    myStation: [],
  });



  const emailcheck = () => {
    if (values.email === "") {
      setErrorText(null);
    } else {
      if (ValidateEmail(values.email)) {
        setErrorText(null);
        setMailError(false);
      } else {
        setMailError(true);
        setErrorText("sorry this is not valid email");
      }
    }
  };

  function ValidateEmail(mail) {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }
    return false;
  }

  const handleChange = (event) => {
    //console.log(event.target.name);
    // console.log(event.target.value);

    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleBlur = (event) => {

  };


  function redirectBackPage(backToLoad) {
    setBackPage(backToLoad);
  }

  function onBacktoHome() {
    try {
			
			const backValue = false;
			redirectBackPage(backValue);

		} catch (err) {
			errorLogs('onBacktoHome', err);
		}
  }

  const [backPage, setBackPage] = useState(true);
  const handleBack = () => {
    setBackPage(false);
  };

  useEffect(() => {
    // console.log("Config URL :: ", userData);

    if (currentUserId) {
      console.log("USER :: ", userData);

      setValues({
        ...values,
        email: userData.email,
        role: userData.role
      });
    }
  }, []);

  useEffect(() => {
    setIsUpdateUserList(false);
  }, []);

  const onAddClick = () => {
    setSpin(true);

    if (values.email === "") {
      setAlertDialog({
        ...alertDialog,
        isOpen: true,
        title: "Add email",
      });
      setSpin(false);
    } else if (values.role === "") {
      setAlertDialog({
        ...alertDialog,
        isOpen: true,
        title: "Add role",
      });
      setSpin(false);
    } else {
      addUserdata();
    }
  };

  const addUserdata = () => {

    let userStatus = true;

    firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        console.log("user Added :: ", user)
        // ...
        firestoreData.collection("user-list").add({
          email: values.email,
          password: values.password,
          role: values.role,
          userId: user.uid,
          loginFlag: userStatus,
        }).then(function (docRef) {
          setValues({
            ...values,
            email: '',
            password: '',
            role: 'Admin',
            userStatus: 'true'
          })
          setSpin(false);
          setIsUpdateUserList(true);
          onBacktoHome()

        }).catch(error => {
          alert("Error is ", error);
        })


      })
      .catch((error) => {
        setSpin(false);
        var errorMessage = error.message;
        alert(errorMessage)
        // ..
      });
  };

  const onUpdateClick = () => {
    // setSpin(true);
    setSpin(true);

    if (values.email === "") {
      // alert(t('add-user_pleaseenteryourusername'));
      setAlertDialog({
        ...alertDialog,
        isOpen: true,
        title: "Add email",
      });
      setSpin(false);
    } else if (values.role === "") {
      // alert(t('add-user_pleaseenteryourusername'));
      setAlertDialog({
        ...alertDialog,
        isOpen: true,
        title: "Add role",
      });
      setSpin(false);
    } else {
      updateUserdata();
    }

    // console.log("values", values);
  };

  const updateUserdata = () => {

    let userStatus = true;
    let docRef = firestoreData.collection("user-list")
			docRef = docRef.where("userId", "==", currentUserId);
			docRef.get().then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					console.log("USER DOC ID ::  ",doc.id)
					docRef.firestore.collection("user-list").doc(doc.id).update({
						email: values.email,
						role: values.role,
						loginFlag: userStatus
					}).then(function () {
						// alert("User Status Updated !");
            setIsUpdateUserList(true);
						setValues({
							...values,
							email: '',
							role: 'Admin',
							userStatus: 'true'
						})
						setSpin(false);
						onBacktoHome()
						
					})
				})
			})

  };

  return (
    <Page className={classes.root} title="Add New User | MOI">
      {backPage && (
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
                onClick={() => handleBack()}
                style={{ margin: "16px", cursor: "pointer" }}
              />
              <Box flexGrow={1}>
                <Typography variant="h4" className={"txtleft"}>
                  {"Add User Form"}
                </Typography>
              </Box>

              {spin ? (
                <CircularProgress
                  color="secondary"
                  style={{ margin: "5px" }}
                  size={20}
                />
              ) : (
                ""
              )}
              {!currentUserId && (
                <Button
                  color="primary"
                  variant="contained"
                  disabled={spin}
                  onClick={onAddClick}
                >
                  <AddCircleIcon className={"btnRightDetails"} />
                  Add
                </Button>
              )}
              {currentUserId && (
                <Button
                  color="primary"
                  variant="contained"
                  disabled={spin}
                  onClick={onUpdateClick}
                >
                  <UpdateIcon className={"btnRightDetails"} />
                  {"Update"}
                </Button>
              )}
            </Box>
            <hr />
            {/* {!currentUserId &&
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <Box p={1} label="Case Completion">
                    <LinearProgress variant="determinate" value={(userCompletion / 8) * 100} />
                  </Box>
                </Grid>
              </Grid>
            } */}
            {/* {!currentUserId &&
              <hr />
            } */}
            <div className="overflowform">
              <CardContent>
                <div className={classes.tab}>
                  <TabContext value={tabValue}>
                    <AppBar position="static">
                      <ThemeProvider theme={outerTheme}>
                        <TabList
                          onChange={handleTabChange}
                          aria-label="profiletab"
                        >
                          <Tab label={"Details"} value="1" />
                        </TabList>
                      </ThemeProvider>
                    </AppBar>
                    <TabPanel value="1">
                      <Grid container spacing={3}>

                        <Grid item md={6} xs={12}>
                          <TextField
                            error={mailerror}
                            helperText={errorText}
                            onBlur={emailcheck}
                            fullWidth
                            label={"Email"}
                            name="email"
                            onChange={handleChange}
                            type="email"
                            required
                            value={values.email}
                            variant="outlined"
                            disabled={currentUserId ? true : false}
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <FormControl
                            variant="outlined"
                            fullWidth
                            className={classes.formControl}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {"User Role"}
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={values.role}
                              name="role"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label={"User Role"}
                            >
                              {/* <Menu> */}
                              <MenuItem value="Admin">
                                <Typography className={"txtleft"}>
                                  {"Admin"}
                                </Typography>
                              </MenuItem>
                              <MenuItem value="USER">
                                <Typography className={"txtleft"}>
                                  {"User"}
                                </Typography>
                              </MenuItem>
                              {/* </Menu> */}
                            </Select>
                          </FormControl>
                        </Grid>


                        {!currentUserId && (
                          <Grid item md={6} xs={12}>
                            <TextField
                              fullWidth
                              label={"Password"}
                              name="password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              value={values.password}
                              variant="outlined"
                            />
                          </Grid>
                        )}

                        <br />
                      </Grid>
                    </TabPanel>
                  </TabContext>
                </div>
              </CardContent>
            </div>

            {/* <Divider /> */}

            {/* </Card> */}
          </form>

          <AlertDialog
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialogfunc}
          />
          
          {/* <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          /> */}
        </Container>
      )}
      {!backPage && <UserListTable updateList={isUpdateUserList} />}
    </Page>
  );

 
};
AddUser.propTypes = {
  className: PropTypes.string,
};

export default AddUser;
