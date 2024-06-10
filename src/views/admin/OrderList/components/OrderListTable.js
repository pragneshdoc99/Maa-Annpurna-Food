/* eslint-disable */
import React, { useMemo, useState, useEffect } from "react";
import {
  Flex,
} from "@chakra-ui/react";
// Custom components
import CardCHk from "components/card/Card";
import {
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Container,
  Card,
  withStyles,
  Tooltip,
  Zoom,
  useTheme
} from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Skeleton from "@material-ui/lab/Skeleton";
import TableFooter from "@material-ui/core/TableFooter";

import NoData from "../../../../assets/img/NoData.jpg";
import AddOrder from "./add-order";
import { SearchIcon } from "@chakra-ui/icons";
import firebase from '../../../../firebase';
import ConfirmDialog from "../../ConfirmDialog";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  pagination: {
    flexShrink: 0,
  },
  table: {
    minWidth: 300,
  },
  active: {
    color: "#228539 !important",
  },
  inactive: {
    color: "#dc3545 !important",
  }
}));

export default function OrderListTable(props) {

  const classes = useStyles();

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [myTempArray, setmyTempArray] = useState([]);

  const [myArray, setmyArray] = useState([]);

  const [detailForm, setDetailForm] = useState(false);
  const [loader, setLoader] = useState(true);
  const [noDataImg, setNoDataImg] = useState(false);

  const [currentUserId, setCurrentUser] = useState("");
  const [listData, setListData] = useState("");

  const [page, setPage] = useState(0);
  const [pagedata, setPagedata] = useState(0);

  useEffect(() => {

    setLoader(true);
    setNoDataImg(true);
    fetchUserData()

  }, []);

  const fetchUserData = () => {

    const database = firebase.firestore();
    let tempDb = database.collection('order-list');
    tempDb.get().then(function (dataSnap) {
      // console.log('GET DATA :: ', dataSnap);
      let tempObj = [];
      dataSnap.forEach(function (doc) {
        let docData = doc.data();
        tempObj.push(docData);
      });
      // console.log('DOC Data again :: ', tempObj);
      const finalData = tempObj.sort((a, b) => b.order_date - a.order_date);

      setmyTempArray(finalData)
      setmyArray(finalData);
      setLoader(false);

      if (tempObj.length <= 0) {
        setNoDataImg(true);
      }
    });
  }



  const handleUserForm = () => {
    setDetailForm(true);
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      boxShadow: theme.shadows[1],
      fontSize: 13,
    },
  }))(Tooltip);

  //-----------------EDIT --------------------
  const editThisFeed = (clientName, itemArr) => {
    try {
      const databaseFld = firebase.firestore();
      let docRef = databaseFld.collection("order-list")
      docRef = docRef.where("clientName", "==", clientName);
      docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log("USER DOC ID ::  ", doc.id);

          setCurrentUser(doc.id);
          setListData(itemArr);
          setDetailForm(true);
        })
      })
    } catch (err) {
      errorLogs('handleDEdit', err);
    }
  };
  //-----------------------------------------

  //-------------------DELETE----------------
  const handleDelete = (value) => {
    // setConfirmDialog({
    //   ...confirmDialog,
    //   isOpen: false,
    // });

    // userChageStatus(value, false)

    let deletionVal = value;

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    try {
      const databaseFld = firebase.firestore();
      let docRef = databaseFld.collection("item-list")
      docRef = docRef.where("itemName", "==", deletionVal);
      docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log("USER DOC ID ::  ", doc.id);
          databaseFld.collection("item-list").doc(doc.id).delete().then(() => {
            console.log("Document successfully deleted!");
            fetchUserData();
          }).catch((error) => {
            console.error("Error removing document: ", error);
          });

        })
      })

    } catch (err) {
      errorLogs('handleDelete', err);
    }

  };

  //------------------------------------------

  //-------------------------------------SEARCH-------------------------------
  const [searchTextFieldValue, setSearchTextFieldValue] = useState("");

  //searching functionality
  const filterByValue = (array, value) =>
    array.filter(
      (data) =>
        data.clientName.toLowerCase().includes(value.toLowerCase()) ||
        data.clientContact.toLowerCase().includes(value.toLowerCase()) ||
        data.tableName.toLowerCase().includes(value.toLowerCase())
    );

  const setSearch = (e) => {
    setSearchTextFieldValue(e.target.value);

    setPage(0);

    const tempData = filterByValue(myTempArray, e.target.value);
    if (tempData.length > 0) {
      setNoDataImg(true);
      setmyArray(tempData);
    } else {
      setNoDataImg(false);
      setmyArray(tempData);
    }
  };
  //-----------------------------------------------------------------------------

  //------------------------------Pagination-------------------------------------
  function TablePaginationActions(props) {
    const classes = useStyles();
    const theme = useTheme();

    const handlepagedata = (data) => {
      // setNoDataImg(false);
      // setLoader(true);
      setLoader(false);
      setNoDataImg(true);
    };

    const handleBackButtonClick = () => {
      setSearchTextFieldValue("");

      setPagedata(pagedata - 1);
      handlepagedata(pagedata - 1);
    };

    const handleNextButtonClick = () => {
      setSearchTextFieldValue("");

      setPagedata(pagedata + 1);
      handlepagedata(pagedata + 1);
    };

    return (
      <div className={classes.pagination}>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={pagedata === 0}
          aria-label={"previous"}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          // disabled={Islastdata}
          aria-label={"next"}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
      </div>
    );
  }
  //-----------------------------------------------------------------------------

  return (
    <CardCHk
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      {!detailForm && (
        <Container maxWidth={false}>
          <Flex justify='space-between' mb='20px' align='center'>

            <Card>
              <CardContent>
                <Box maxWidth={"100%"}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="primary">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      ),
                    }}
                    placeholder={"Search"}
                    value={searchTextFieldValue}
                    onChange={setSearch}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>

            <Button
              color="primary"
              variant="contained"
              onClick={handleUserForm}
            >
              <PersonAddIcon style={{ marginRight: "5px" }} />
              <span>{"Add"}</span>
            </Button>
          </Flex>

          <Box mt={3} mb={3}>
            <Card>
              <Box md={12}>
                <div className="overflowtable">
                  {loader && (
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}

                  {!noDataImg && !loader && <img src={NoData}></img>}

                  {!loader && noDataImg && (
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={"txtleft"}>{"Name"}</TableCell>
                          <TableCell className={"txtleft"}>{"Contact"}</TableCell>
                          <TableCell className={"txtleft"}>{"Date"}</TableCell>
                          <TableCell className={"txtleft"}>{"Table No."}</TableCell>
                          <TableCell></TableCell>
                          {/* <TableCell></TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {myArray.map((data) => (
                          <TableRow
                            hover
                          >
                            <TableCell
                              align={"left"}
                              className={classes.active}
                            >
                              {data.clientName}
                            </TableCell>
                            <TableCell
                              align={"left"}
                              className={classes.active}
                            >
                              {data.clientContact}
                            </TableCell>
                            <TableCell
                              align={"left"}
                              className={classes.active}
                            >
                              {moment(new Date(data.order_date)).format('DD/MM/YYYY')}
                            </TableCell>

                            <TableCell
                              align={"left"}
                              className={classes.active}
                            >
                              {data.tableName}
                            </TableCell>

                            <TableCell
                              align={"left"}
                              component="th"
                              scope="row"
                            >
                              <LightTooltip
                                className={classes.tooltip}
                                TransitionComponent={Zoom}
                                title={"Edit User"}
                              >
                                <EditIcon
                                  onClick={() => editThisFeed(data.clientName, data)}
                                  variant="contained"
                                  size="sm"
                                  style={{ color: "#20382b" }}
                                />
                              </LightTooltip>
                            </TableCell>

                            {/* <TableCell align={"left"}>
                              <LightTooltip
                                TransitionComponent={Zoom}
                                title={"Delete User"}
                              >
                                <DeleteIcon
                                  color="primary"
                                  variant="contained"
                                  onClick={() =>
                                    setConfirmDialog({
                                      isOpen: true,
                                      title:
                                        "are you sure you want to delete this item ?",
                                      subTitle:
                                        "once deleted you cant undo this action",
                                      onConfirm: () => {
                                        handleDelete(data.itemName);
                                      },
                                    })
                                  }
                                ></DeleteIcon>
                              </LightTooltip>
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[10]}
                            count={myArray.length}
                            rowsPerPage={20}
                            page={page}
                            ActionsComponent={TablePaginationActions}
                            style={{ overflow: "visible" }}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  )}
                </div>
              </Box>
            </Card>
          </Box>
        </Container>
      )}

      {detailForm && !currentUserId ? <AddOrder /> : ""}

      {currentUserId && detailForm ? (
        <AddOrder currentUserId={currentUserId} dataDetails={listData} />
      ) : (
        ""
      )}

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

    </CardCHk>
  );
}
