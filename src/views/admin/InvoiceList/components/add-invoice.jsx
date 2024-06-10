/* eslint-disable */

import React, { useState, useEffect } from "react";
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../../../firebase';
import clsx from "clsx";
import PropTypes from "prop-types";
import AlertDialog from "../../../../popup/AlertDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green, pink } from "@material-ui/core/colors";
import Page from "../../../page";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";


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
import InvoiceListTable from "./InvoiceListTable";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GenerateInvoice from "./GenerateInvoice";

const tablelogoimg = {
  width: "100px",
  height: "100px",
  objectFit: "contain"
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);



const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
  },
  formControl: {
    width: "100%",
    variant: "outlined",
    marginTop: "5px",
    marginBottom: "5px",
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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    height: "90vh",
    overflowY: "auto",
    width: "90%",

  }
}));

`
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




let tempDataArray = [];
let tmpRestAmmount = 0;
let inputValue = 0;
let tempInvoiceCount = 0;
let orderCountDoc = '';

const AddInvoice = ({
  currentUserId,
  viweOnly,
  className,
  redirectBack,
  orderDetails,
  ...rest
}) => {
  const classes = useStyles();

  const [values, setValues] = useState({
    paidAmmount: 0
  });

  const [spin, setSpin] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  let [paymentArray, setPaymentArray] = useState([]);

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [backPage, setBackPage] = useState(true);

  let [basicDetails, setBasicDetails] = useState({});
  let [transferObj, setTransferObj] = useState({});
  let [finalList, setFinalList] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [openModal, setModalOpen] = React.useState(false);
  const [isPaidBill, setIsPaidBill] = React.useState(false);



  const setAlertDialogfunc = () => {
    setAlertDialog({
      ...alertDialog,
      isOpen: false,
      title: "",
      subTitle: "",
    });
  };

  useEffect(() => {

    // console.log('orderDetailsData :: ', orderDetails);

    setBasicDetails(orderDetails);
    setTotalCost(orderDetails.orderTotalAmmount.toFixed(2))


    tempDataArray = []
    orderDetails.itemList.map((val, index) => {

      tempDataArray.push({
        itemName: val.itemName,
        itemType: val.itemType,
        productQty: val.productQty,
        productPrice: val.productPrice,
        totalItemPrice: val.totalItemPrice
      })

    })

    setFinalList(tempDataArray);


    if (currentUserId) {
      checkInvoiceData();
    }



  }, []);

  const checkInvoiceData = async () => {
    try {
      let firestoreData = firebase.firestore();
      let docRef = firestoreData.collection("invoice-list").doc(currentUserId);
      let doc = await docRef.get();

      if (doc.exists) {
        // console.log("HERE :: ", doc.data());
        let invoiceObj = doc.data();

        //----INVOICE COUNT ---------
        tempInvoiceCount = invoiceObj.invoiceNo;

        let tempObj = [];
        tempObj = invoiceObj.paymentDetails;
        let finalObjData = tempObj.sort((a, b) => b.paidDate - a.paidDate);

        setPaymentArray(finalObjData)
        setIsPaidBill(invoiceObj.isPaidBill)


      } else {
        newInvoiceDataFun()
      }
    } catch (error) {
      console.error('Error checking document:', error);
    }
  };



  const newInvoiceDataFun = () => {

    //----INVOICE COUNT INCRESE ---------
    const database = firebase.firestore();
    let tempDb = database.collection('order-count');
    tempDb.get().then(function (dataSnap) {
      tempInvoiceCount = 0;
      dataSnap.forEach(function (doc) {
        let docData = doc.data();
        // console.log('docData Count :: ', docData);
        tempInvoiceCount = (parseInt(docData.invoiceNo) + 1);
        // console.log("COUNR :: ", tempInvoiceCount);

      });
    })

  }


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

    if (isPaidBill) {
      // console.log("PAID BILL ALREADY")
      setSpin(false);
      commonSaveDataFun(paymentArray)

    } else {
      // console.log("UNPAID BILL")

      if (!parseFloat(values.paidAmmount)) {
        setSpin(false);
        setAlertDialog({
          isOpen: true,
          title: "Please Enater Valid Paid Ammount.",
        });
      } else if (parseFloat(values.paidAmmount) !== parseFloat(totalCost)) {
        setSpin(false);
        setAlertDialog({
          isOpen: true,
          title: "Your Paid Ammount Is't Match with Total Ammount :: " + totalCost + ".",
        });
      } else {
        paymentArray.push({
          paidAmmount: values.paidAmmount,
          paidDate: new Date(basicDetails.order_date).getTime()
        })
        commonSaveDataFun(paymentArray)
      }

    }

  };

  const commonSaveDataFun = (paymentArray) => {

    const detailObj = {
      userId: basicDetails.userId,
      userEmail: basicDetails.userEmail,
      clientName: basicDetails.clientName,
      clientContact: basicDetails.clientContact,
      tableName: basicDetails.tableName,
      order_date: new Date(basicDetails.order_date).getTime(),
      itemList: basicDetails.itemList,
      orderTotalAmmount: basicDetails.orderTotalAmmount,
      paymentDetails: paymentArray,
      invoiceNo: tempInvoiceCount.toString(),
      isPaidBill: true,

    };

    // console.log("detailObj :: ", detailObj);


    saveInvoiceDataFun(detailObj)
  }

  const saveInvoiceDataFun = async (detailObj) => {

    let firestoreData = firebase.firestore();
    let docRef = firestoreData.collection("invoice-list").doc(currentUserId);
    let doc = await docRef.get();

    if (doc.exists) {

      commonUpdateInvoiceData(detailObj)
    } else {
      // console.log("NEW USER");

      orderCountDoc = 'II7rySKg8MJRPpZCsrm9';

      const orderCountObj = {
        invoiceNo: tempInvoiceCount.toString()
      }

      firestoreData.collection("order-count").doc(orderCountDoc).update(orderCountObj).then(() => {

        const databaseFld = firebase.firestore();
        let docRef = databaseFld.collection("table-list")
        docRef = docRef.where("tableName", "==", basicDetails.tableName);
        docRef.get().then((querySnapshot) => {

          querySnapshot.forEach((doc) => {
            // console.log("USER DOC ID ::  ", doc.id);
            let setTempObj = {
              inUseStatus: false
            };
            let tempDb = databaseFld.collection('table-list');
            tempDb = tempDb.doc(doc.id).update(setTempObj).then(function (docRef) {
              commonUpdateInvoiceData(detailObj)
            })

          })

        })

      })
    }

  }

  const commonUpdateInvoiceData = (detailObj) => {

    let firestoreData = firebase.firestore();
    firestoreData.collection("invoice-list").doc(currentUserId).set(detailObj).then(() => {
      // alert("User Status Updated !");

      setTransferObj(detailObj);

      setValues({
        ...values,
        paidAmmount: 0,
      })

      paymentArray = []

      setSpin(false);
      setModalOpen(true);

    })
  }


  const handleModalClose = () => {
    setModalOpen(false);
    setBackPage(false);
  };



  const handleChange = (event) => {


    inputValue = parseFloat(event.target.value);
    setValues({
      ...values,
      paidAmmount: inputValue
    });


  };

  const classesForModal = useStyles();

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
                    {"Generate Invoice Form"}
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
                    {currentUserId ? "Generate" : "Add"}
                  </Button>
                )}
              </Box>
              <hr />
              <div className="overflowform">
                <Card style={{ minHeight: "500px", marginBottom: "20px" }}>
                  <CardContent>

                    <Grid container sm={12} md={12} direction="column">
                      <Grid
                        item
                        sm={12}
                        md={12}
                        style={{
                          display: 'block',
                          margin: '40px'
                        }}
                      >
                        <Table className={classes.table} aria-label="customized table">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell colSpan={8} style={{ backgroundColor: "transparent" }} align="center">
                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                                  <p style={{ fontSize: "17px", margin: "13px", color: '#000000' }}>{'Customer Name :: ' + basicDetails.clientName}</p>
                                  <p style={{ fontSize: "17px", margin: "13px", color: '#000000' }}>{'Contact No. :: ' + basicDetails.clientContact}</p>
                                  <p style={{ fontSize: "17px", margin: "13px", color: '#000000' }}>{'Order On :: ' + new Date(basicDetails.order_date).toDateString()}</p>
                                  <p style={{ fontSize: "17px", margin: "13px", color: '#000000' }}>{'Table On :: ' + basicDetails.tableName}</p>
                                </div>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell align="left">Sr No</StyledTableCell>
                              <StyledTableCell align="left">Item</StyledTableCell>
                              <StyledTableCell align="left">Type</StyledTableCell>
                              <StyledTableCell align="left">QTY</StyledTableCell>
                              <StyledTableCell align="left">Rate</StyledTableCell>
                              <StyledTableCell align="right">Total</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {finalList.map((row, index) => (
                              <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row" align="left">
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.itemName}</StyledTableCell>
                                <StyledTableCell align="left">{row.itemType}</StyledTableCell>
                                <StyledTableCell align="left">{row.productQty}</StyledTableCell>
                                <StyledTableCell align="left">{row.productPrice}</StyledTableCell>
                                <StyledTableCell align="right">{row.totalItemPrice}</StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell align="left">Total Ammount</StyledTableCell>
                              <StyledTableCell align="left"></StyledTableCell>
                              <StyledTableCell align="left"></StyledTableCell>
                              <StyledTableCell align="left"></StyledTableCell>
                              <StyledTableCell align="left"></StyledTableCell>
                              <StyledTableCell align="right">{totalCost}</StyledTableCell>
                            </TableRow>

                          </TableHead>
                        </Table>
                      </Grid>
                    </Grid>

                    {!isPaidBill &&
                      <Grid container spacing={3}>
                        <Grid item md={3} xs={12}>
                          <Typography variant="h6" style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                            {"Paid Ammount :: "}
                          </Typography>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <TextField
                            fullWidth
                            label={"Ammount"}
                            name="paidAmmount"
                            onChange={handleChange}
                            required
                            value={values.paidAmmount}
                            variant="outlined"
                            type="number"
                          />
                        </Grid>
                      </Grid>
                    }

                    {isPaidBill &&
                      <div
                        style={{
                          display: 'block',
                          marginTop: '20px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                          <p style={{ fontSize: "20px", margin: "15px", color: '#000000' }}>{'-:: Paid Payment Details ::- '}</p>
                        </div>

                        <Grid container sm={12} md={12} direction="column">
                          <Grid
                            item
                            sm={12}
                            md={12}
                            style={{
                              display: 'block',
                              marginTop: '20px'
                            }}
                          >
                            <Table className={classes.table} aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell align="left">Sr No</StyledTableCell>
                                  <StyledTableCell align="left">Paid Ammount</StyledTableCell>
                                  <StyledTableCell align="left">Date</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {paymentArray.map((row, index) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row" align="left">
                                      {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.paidAmmount}</StyledTableCell>
                                    <StyledTableCell align="left">{moment(new Date(row.paidDate)).format('DD/MM/YYYY')}</StyledTableCell>
                                  </StyledTableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Grid>
                        </Grid>
                      </div>
                    }
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

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classesForModal.modal}
            open={openModal}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={openModal}>
              <div className={classesForModal.paper}>
                <GenerateInvoice selectedDocId={currentUserId} orderDetailsData={transferObj} />
              </div>
            </Fade>
          </Modal>

        </Page>
      )}
      {!backPage && <InvoiceListTable />}
    </div>
  );
};


AddInvoice.propTypes = {
  className: PropTypes.string,
};

export default AddInvoice;
