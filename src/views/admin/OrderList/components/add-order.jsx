/* eslint-disable */

import React, { useState, useEffect } from "react";
import firebase from '../../../../firebase';
import clsx from "clsx";
import PropTypes from "prop-types";
import AlertDialog from "../../../../popup/AlertDialog";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
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
import moment from "moment";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
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
  Divider
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import OrderListTable from "./OrderListTable";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
  },
  formControl: {
    width: "100%",
    variant: "outlined"
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

const objToCheck = [];

let tmpPriceVal = 0;
let tmpArray = [];

let tmpItemArray = [];

let itemDetailArray = [];
let useEffProdArray = [];


const AddOrder = ({
  currentUserId,
  viweOnly,
  className,
  redirectBack,
  dataDetails,
  ...rest
}) => {
  const classes = useStyles();

  const [tableListArray, setTableListArray] = useState([]);
  const [itemListArray, setItemListArray] = useState([]);
  const [bkpItemListArray, setBkpItemListArray] = useState([]);
  const [productListArray, setProductListArray] = useState([]);
  const [tabValue, setTabValue] = React.useState("1");
  const [spin, setSpin] = useState(false);
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [backPage, setBackPage] = useState(true);
  const [values, setValues] = useState({
    tableName: '',
    clientName: '',
    clientContact: 0,
    order_date: ''
  });




  const FeildNameForProduct = {
    productQty: 0,
    productPrice: 0,
    totalItemPrice: 0,

    itemName: '',
    itemType: ''
  }

  const [additionalProd, setAdditionalProd] = useState([FeildNameForProduct]);
  const [totalRentValue, setTotalRentValue] = useState(0);

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

      setValues({
        ...values,
        tableName: dataDetails.tableName,
        clientName: dataDetails.clientName,
        clientContact: dataDetails.clientContact,
        order_date: moment(new Date(dataDetails.order_date)).format('YYYY-MM-DD')
      })

      let dummyArray = dataDetails.itemList;

      console.log('dummyArray : ', dummyArray)
      useEffProdArray = [];
      dummyArray.map((val, ind) => {


        useEffProdArray.push({
          productQty: val.productQty,
          productPrice: val.productPrice,
          totalItemPrice: val.totalItemPrice,
          itemName: val.itemName,
          itemType: val.itemType

        })

      })



      setAdditionalProd(useEffProdArray);
      setTotalRentValue(dataDetails.orderTotalAmmount)

    }

    fetchTableData()
    fetchItemData()


  }, []);

  const fetchTableData = () => {
    const database = firebase.firestore();
    let tempDb = database.collection('table-list');
    tempDb.get().then(function (dataSnap) {
      // console.log('GET DATA :: ', dataSnap);
      let tempObj = [];
      dataSnap.forEach(function (doc) {
        let docData = doc.data();
        if (!docData.inUseStatus) {
          tempObj.push(docData);
        }
      });
      // console.log('DOC Data again :: ', tempObj);
      setTableListArray(tempObj)

    });
  }

  const fetchItemData = () => {
    const database = firebase.firestore();
    let tempDb = database.collection('item-list');
    tempDb.get().then(function (dataSnap) {
      // console.log('GET DATA :: ', dataSnap);
      let tempObj = [];
      dataSnap.forEach(function (doc) {
        let docData = doc.data();
        tempObj.push(docData);
      });
      // console.log('DOC Data again :: ', tempObj);
      setItemListArray(tempObj)
      setBkpItemListArray(tempObj)

    });
  }


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


  const getObject = (item) => {
    objToCheck.splice(0, 1, { ...item });
  };

  const onAddMoreDetails = () => {

    console.log("additionalProd :: ", additionalProd);

    if (additionalProd.length > 0) {
      checkAllFeilds(objToCheck[0])
        ? addNewOne()
        : alert('Please filed all the details .');

    } else {
      alert('Please filed all the details.');
    }

  }

  const addNewOne = () => {

    tmpPriceVal = 0;
    tmpArray = [];

    let newfeild = { ...FeildNameForProduct };
    setAdditionalProd([...additionalProd, newfeild])

  }

  const checkAllFeilds = (objectOfLastForm) => {
    let key = Object.values(objectOfLastForm)
    // console.log('objectOfLastForm :: ', objectOfLastForm);
    if (key.length === 0) {
      return false
    }
    for (let i = 0; i < key.length; i++) {
      if (key[i] === '' || key[i] === 0) {
        return false
      }
    }
    return true
  }




  const onUpdateDetails = () => {
    // console.log('additionalProd :: ', additionalProd);
    // console.log('values :: ', values);

    setSpin(true);

    let tmpUserId = localStorage.getItem('userId');
    let tmpEmail = localStorage.getItem('email');

    if (values.tableName == "") {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Enter Table Name.",
      });
    } else if (values.clientName == "") {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Enter Name.",
      });
    } else if (values.clientContact == "") {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Enter Contact No.",
      });
    } else if (values.order_date === '') {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Enter Date.",
      });
    } else if (additionalProd.length === 0) {
      setSpin(false);
      setAlertDialog({
        isOpen: true,
        title: "Please Select Item Type, Name and Its Qty.",
      });
    } else {

      if (!currentUserId) {

        console.log("additionalProd :: ", additionalProd);

        itemDetailArray = [];

        additionalProd.map((val, ind) => {
          itemDetailArray.push({
            itemName: val.itemName,
            itemType: val.itemType,
            productPrice: val.productPrice,
            productQty: val.productQty,
            totalItemPrice: val.totalItemPrice
          })

          if (ind === additionalProd.length - 1) {
            saveOrderData(tmpUserId, tmpEmail)
          }
        })


      } else {

        console.log("additionalProd :: ", additionalProd);

        const detailObj = {
          userId: tmpUserId,
          userEmail: tmpEmail,
          tableName: values.tableName,
          clientName: values.clientName,
          clientContact: values.clientContact,
          order_date: new Date(values.order_date).getTime(),
          itemList: additionalProd,
          orderTotalAmmount: totalRentValue
        };

        // console.log("detailObj :: ", detailObj);

        let firestoreData = firebase.firestore();
        firestoreData.collection("order-list").doc(currentUserId).update(detailObj).then(() => {
          // alert("User Status Updated !");
          setValues({
            ...values,
            tableName: "",
            clientName: "",
            clientContact: "",
            order_date: "",
          })

          setAdditionalProd([FeildNameForProduct])

          setAlertDialog({
            isOpen: true,
            title: "Order update successfully",
          });

          setBackPage(false);

        })

      }
    }
  };

  const saveOrderData = (tmpUserId, tmpEmail) => {

    const detailObj = {
      userId: tmpUserId,
      userEmail: tmpEmail,
      tableName: values.tableName,
      clientName: values.clientName,
      clientContact: values.clientContact,
      order_date: new Date(values.order_date).getTime(),
      itemList: itemDetailArray,
      orderTotalAmmount: totalRentValue
    };

    console.log("OBJ :: ", detailObj);

    const databaseFld = firebase.firestore();
    let docRef = databaseFld.collection("table-list")
    docRef = docRef.where("tableName", "==", values.tableName);
    docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("USER DOC ID ::  ", doc.id);
        let setTempObj = {
          inUseStatus: true
        };
        let tempDb = databaseFld.collection('table-list');
        tempDb = tempDb.doc(doc.id).update(setTempObj).then(function (docRef) {

          console.log("UPDATED")

          databaseFld.collection("order-list").add(detailObj).then((docRef) => {

            setValues({
              ...values,
              tableName: "",
              clientName: "",
              clientContact: "",
              order_date: "",
            })

            setAdditionalProd([FeildNameForProduct])

            setAlertDialog({
              isOpen: true,
              title: "Order added successfully",
            });

            setBackPage(false);

          }).catch(error => {
            alert("Error is ", error);
          })

        })

      })
    });


  }


  //----------------------------- AUTOSELECT ONCHANG-------------------
  const handleAutoCompleteChangeTable = (event, value) => {
    if (value === null || value === "") {
      setValues({
        ...values,
        tableName: "",
      });
    } else {
      if (value.tableName === "") {
        setValues({
          ...values,
          tableName: "",
        });
      } else {
        setValues({
          ...values,
          tableName: value.tableName
        });
      }
    }
  };



  const handleChangeProduct = (event, index) => {


    let tmpName = event.target.name;
    let tmpValue = event.target.value;

    tmpArray = [];
    if (tmpName === 'itemType') {
      tmpArray = [...additionalProd];
      tmpArray[index].itemType = tmpValue;


      tmpArray[index].itemName = '';
      tmpArray[index].productQty = 0;
      tmpArray[index].productPrice = 0;
      tmpArray[index].totalItemPrice = 0;

      tmpItemArray = []
      bkpItemListArray.map((val, index) => {

        if (tmpValue === val.itemType) {
          tmpItemArray.push(val)
        }

      })

      setItemListArray(tmpItemArray);
    }

    // if (tmpArray[index].itemName) {

    if (tmpName === 'productQty') {
      // tmpArray = [...additionalProd];
      // tmpArray[index].productPrice = tmpArray[index].itemPrice;

      // tmpArray[index].totalItemPrice = 0;

      if (event.target.value > 0) {

        tmpArray = [...additionalProd];
        tmpArray[index].productQty = tmpValue;

        tmpPriceVal = (tmpValue * tmpArray[index].productPrice);
        tmpArray[index].totalItemPrice = tmpPriceVal;

      } else {
        tmpArray = [...additionalProd];
        tmpArray[index].productQty = tmpValue;
      }
    }
    // }



    let tmp_order_price = 0;

    for (let i = 0; i < tmpArray.length; i++) {
      tmp_order_price += parseFloat(tmpArray[i].totalItemPrice);
    }

    // console.log('tmpArray :: ', tmpArray);

    setAdditionalProd(tmpArray);
    setTotalRentValue(tmp_order_price);

  };

  const handleAutoCompleteChangeItem = (event, value, index) => {
    console.log("INDEX :: ", index);
    console.log("value :: ", value);

    if (value === null || value === "") {

      tmpArray = [...additionalProd];
      tmpArray[index].itemName = "";
      tmpArray[index].itemType = "";

      tmpArray[index].productQty = 0;
      tmpArray[index].productPrice = 0;
      tmpArray[index].totalItemPrice = 0;
    } else {

      if (value.itemName === "") {

        tmpArray = [...additionalProd];
        tmpArray[index].itemName = "";
        tmpArray[index].itemType = "";

        tmpArray[index].productQty = 0;
        tmpArray[index].productPrice = 0;
        tmpArray[index].totalItemPrice = 0;

      } else {


        if (tmpArray[index].itemName === "") {
          tmpArray = [...additionalProd];
          tmpArray[index].itemName = value.itemName;
          tmpArray[index].itemType = value.itemType;
          tmpArray[index].productPrice = parseFloat(value.itemPrice);

          tmpArray[index].productQty = 0;
          tmpArray[index].totalItemPrice = 0;
        } else {
          if (tmpArray[index].itemName === value.itemName) {

            tmpArray = [...additionalProd];
            tmpArray[index].itemName = value.itemName;
            tmpArray[index].itemType = value.itemType;
            tmpArray[index].productPrice = parseFloat(value.itemPrice);

            // tmpArray[index].productQty = 0;
            // tmpArray[index].productPrice = 0;
            // tmpArray[index].totalItemPrice = 0;

          } else {
            //---- COMPELETE INSIDE-------------
            tmpArray = [...additionalProd];
            tmpArray[index].itemName = value.itemName;
            tmpArray[index].itemType = value.itemType;
            tmpArray[index].productPrice = parseFloat(value.itemPrice);

            console.log("OK :: ", tmpArray[index]);

            tmpArray[index].productQty = 0;
            tmpArray[index].totalItemPrice = 0;
          }
        }


      }
    }

    setAdditionalProd(tmpArray);
  }



  const handleBlur = (event) => {
    if (event.target.name === "tableName") {
      if (event.target.value === "") {
        setValues({
          ...values,
          tableName: "",
        });
      }
    }

  };


  return (
    <div>
      {backPage && (
        <Page className={classes.root} title={"Add New Order"}>
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
                    {"Order Form"}
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

                            {!currentUserId &&
                              <Grid item md={3} xs={12}>
                                <Autocomplete
                                  id="tableListArray"
                                  options={tableListArray}
                                  getOptionLabel={(option) =>
                                    option.tableName || values.tableName
                                  }
                                  // defaultValue={}
                                  filterSelectedOption
                                  disabled={viweOnly}
                                  renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                      <Chip
                                        variant="outlined"
                                        label={option.tableName}
                                        {...getTagProps({ index })}
                                      />
                                    ))
                                  }
                                  name="tableName"
                                  value={values.tableName}
                                  onChange={handleAutoCompleteChangeTable}
                                  onBlur={handleBlur}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name="userState"
                                      variant="outlined"
                                      label={"Table"}
                                      placeholder={"Select* "}
                                    />
                                  )}
                                />
                              </Grid>
                            }

                            <Grid item md={3} xs={12}>
                              <TextField
                                fullWidth
                                label={"Name"}
                                name="clientName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                value={values.clientName}
                                disabled={viweOnly}
                                variant="outlined"
                                type="text"
                              />
                            </Grid>

                            <Grid item md={3} xs={12}>
                              <TextField
                                fullWidth
                                label={"Contact No."}
                                name="clientContact"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                value={values.clientContact}
                                disabled={viweOnly}
                                variant="outlined"
                                type="number"
                              />
                            </Grid>

                            <Grid item md={3} xs={12}>
                              <TextField
                                id="Date"
                                label="Order Date"
                                type="date"
                                value={values.order_date}
                                defaultValue={values.order_date}
                                name="order_date"
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: true
                                }}
                                variant="outlined"
                                style={{
                                  width: '100%',
                                  marginLeft: '0',
                                  marginRight: '0'
                                }}
                              />
                            </Grid>

                          </Grid>

                          <div>
                            {additionalProd.map((item, index) => {
                              getObject(item);
                              return (
                                <div
                                  style={{
                                    border: '1px solid black',
                                    marginTop: '10px',
                                    paddingRight: '24px'
                                  }}
                                >
                                  <Grid style={{ padding: '10px' }} container spacing={3}>

                                    <Grid item md={2} xs={12}>
                                      <FormControl
                                        variant="outlined"
                                        fullWidth
                                        className={classes.formControl}
                                      >
                                        <InputLabel id="demo-simple-select-outlined-label">
                                          {"Type"}
                                        </InputLabel>
                                        <Select
                                          labelId="demo-simple-select-outlined-label"
                                          id="demo-simple-select-outlined"
                                          value={additionalProd[index].itemType}
                                          name="itemType"
                                          onChange={(e) => handleChangeProduct(e, index)}
                                          // onChange={handleChange}
                                          // onBlur={handleBlur}
                                          label={"type"}
                                        >
                                          <MenuItem value="Panjabi">
                                            <Typography className={"txtleft"}>
                                              {"Panjabi"}
                                            </Typography>
                                          </MenuItem>
                                          <MenuItem value="Chinese">
                                            <Typography className={"txtleft"}>
                                              {"Chinese"}
                                            </Typography>
                                          </MenuItem>
                                          <MenuItem value="Gujrati">
                                            <Typography className={"txtleft"}>
                                              {"Gujrati"}
                                            </Typography>
                                          </MenuItem>
                                          <MenuItem value="southIndian">
                                            <Typography className={"txtleft"}>
                                              {"South Indian"}
                                            </Typography>
                                          </MenuItem>
                                          <MenuItem value="Soup">
                                            <Typography className={"txtleft"}>
                                              {"Soup"}
                                            </Typography>
                                          </MenuItem>
                                          <MenuItem value="Starters">
                                            <Typography className={"txtleft"}>
                                              {"Starters"}
                                            </Typography>
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12}>
                                      <Autocomplete
                                        id="itemListArray"
                                        options={itemListArray}
                                        getOptionLabel={(option) =>
                                          option.itemName || additionalProd[index].itemName
                                        }
                                        // defaultValue={}
                                        filterSelectedOption
                                        disabled={viweOnly}
                                        renderTags={(value, getTagProps) =>
                                          value.map((option, index) => (
                                            <Chip
                                              variant="outlined"
                                              label={option.itemName}
                                              {...getTagProps({ index })}
                                            />
                                          ))
                                        }
                                        name="itemName"
                                        value={additionalProd[index].itemName}
                                        onChange={(event, value) => handleAutoCompleteChangeItem(undefined, value, index)}
                                        onBlur={handleBlur}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            name="item"
                                            variant="outlined"
                                            label={"Item"}
                                            placeholder={"Select* "}
                                          />
                                        )}
                                      />
                                    </Grid>

                                    <Grid item md={2} xs={12}>
                                      <TextField
                                        fullWidth
                                        label={"Qty"}
                                        name="productQty"
                                        onChange={(e) => handleChangeProduct(e, index)}
                                        // onBlur={handleBlur}
                                        required
                                        value={additionalProd[index].productQty}
                                        disabled={viweOnly}
                                        variant="outlined"
                                        type="number"
                                      />
                                    </Grid>

                                    <Grid item md={2} xs={12}>
                                      <TextField
                                        fullWidth
                                        label={"Price"}
                                        name="productPrice"
                                        onChange={(e) => handleChangeProduct(e, index)}
                                        required
                                        value={additionalProd[index].productPrice}
                                        disabled={true}
                                        variant="outlined"
                                        type="number"
                                      />
                                    </Grid>

                                    <Grid item md={2} xs={12}>
                                      <TextField
                                        fullWidth
                                        label={"Total"}
                                        name="totalItemPrice"
                                        onChange={(e) => handleChangeProduct(e, index)}
                                        // onBlur={handleBlur}
                                        required
                                        value={additionalProd[index].totalItemPrice}
                                        disabled={true}
                                        variant="outlined"
                                        type="number"
                                      />
                                    </Grid>

                                    <Grid item md={1} xs={12}>
                                      <Button
                                        color="primary"
                                        variant="contained"
                                        disabled={spin}
                                        onClick={(e) => { onAddMoreDetails(e, index); }}
                                      >
                                        <AddCircleIcon className={"btnRightDetails"} />
                                      </Button>
                                    </Grid>

                                  </Grid>

                                </div>
                              )
                            }
                            )}
                          </div>

                          <Grid container spacing={3} style={{ marginTop: '5px' }}>
                            <Grid item md={6} xs={12}>
                              <TextField
                                fullWidth
                                label={"Total Ammount"}
                                name="totalRentValue"
                                required
                                value={totalRentValue}
                                disabled={true}
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
      {!backPage && <OrderListTable />}
    </div>
  );
};


AddOrder.propTypes = {
  className: PropTypes.string,
};

export default AddOrder;
