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
import AddUser from "./add-user";
import { SearchIcon } from "@chakra-ui/icons";
import firebase from '../../../../firebase';
import ConfirmDialog from "../../ConfirmDialog";

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

export default function UserListTable(props) {

  const classes = useStyles();

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [myTempArray, setmyTempArray] = useState([]);
  const [myArray, setmyArray] = useState([]);

  const [userForm, setUserForm] = useState(false);
  const [loader, setLoader] = useState(true);
  const [noDataImg, setNoDataImg] = useState(false);

  const [currentUserId, setCurrentUser] = useState("");
  const [userData, setUserData] = useState("");

  const [page, setPage] = useState(0);
  const [pagedata, setPagedata] = useState(0);

  useEffect(() => {

    setLoader(true);
    setNoDataImg(true);
    fetchUserData()

  }, []);

  const fetchUserData = () => {

    const database = firebase.firestore();
    let tempDb = database.collection('user-list');
    tempDb.get().then(function (dataSnap) {
      // console.log('GET DATA :: ', dataSnap);
      let tempObj = [];
      dataSnap.forEach(function (doc) {
        let docData = doc.data();
        if (docData.loginFlag) {
          tempObj.push(docData);
        }
      });
      console.log('DOC Data again :: ', tempObj);
      setmyTempArray(tempObj)
      setmyArray(tempObj);
      setLoader(false);

      if (tempObj.length <= 0) {
        setNoDataImg(true);
      }
    });
  }



  const handleUserForm = () => {
    setUserForm(true);
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      boxShadow: theme.shadows[1],
      fontSize: 13,
    },
  }))(Tooltip);

  //-----------------EDIT --------------------
  const editThisFeed = (userID, user) => {
    setCurrentUser(userID);
    setUserData(user)
    setUserForm(true);
  };
  //-----------------------------------------

  //-------------------DELETE----------------
  const handleDelete = (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    userChageStatus(value, false)

  };

  const userChageStatus = (userId, status) => {
    let firestoreDB = firebase.firestore();
    let docRef = firestoreDB.collection("user-list")
    docRef = docRef.where("userId", "==", userId);
    docRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log("USER DOC ID ::  ", doc.id)
        firestoreDB.collection("user-list").doc(doc.id).update({
          loginFlag: status
        }).then(function () {
          // alert("User Status Updated !");
          fetchUserData();

        })
      })
    })
  }

  //------------------------------------------

  //-------------------------------------SEARCH-------------------------------
  const [searchTextFieldValue, setSearchTextFieldValue] = useState("");

  //searching functionality
  const filterByValue = (array, value) =>
    array.filter(
      (data) =>
        data.email.toLowerCase().includes(value.toLowerCase()) ||
        data.role.toLowerCase().includes(value.toLowerCase())
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
      {!userForm && (
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
                    placeholder={"Search for user"}
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
                          <TableCell className={"txtleft"}>{"Email"}</TableCell>
                          <TableCell className={"txtleft"}>{"Role"}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {myArray.map((product) => (
                          // console.log("PRODU :: ", product),
                          <TableRow
                            hover
                          >
                            <TableCell
                              align={"left"}
                              className={classes.active}
                            >
                              {product.email}
                            </TableCell>
                            <TableCell
                              align={"left"}
                              className={classes.active}
                            >
                              {product.role}
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
                                  onClick={() => editThisFeed(product.userId, product)}
                                  variant="contained"
                                  size="sm"
                                  style={{ color: "#20382b" }}
                                />
                              </LightTooltip>
                            </TableCell>

                            <TableCell align={"left"}>
                              <LightTooltip
                                TransitionComponent={Zoom}
                                title={"Delete User"}
                              >
                                {/* Translation-content */}
                                <DeleteIcon
                                  color="primary"
                                  variant="contained"
                                  onClick={() =>
                                    setConfirmDialog({
                                      isOpen: true,
                                      title:
                                        "are you sure you want to delete this user ?",
                                      subTitle:
                                        "once deleted you cant undo this action",
                                      onConfirm: () => {
                                        handleDelete(product.userId);
                                      },
                                    })
                                  }
                                ></DeleteIcon>
                              </LightTooltip>
                            </TableCell>
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

      {userForm && !currentUserId ? <AddUser /> : ""}

      {currentUserId && userForm ? (
        <AddUser currentUserId={currentUserId} userData={userData} />
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
