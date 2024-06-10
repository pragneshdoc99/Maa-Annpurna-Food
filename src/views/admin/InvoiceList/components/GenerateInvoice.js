/*eslint-disable */
import React, { useEffect, useState } from 'react';
import firebase from '../../../../firebase';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import html2pdf from "html2pdf.js";
import logodownload from "../../../../assets/img/layout/logoWhite.png"
import moment from "moment";

import { Button, Container, Grid, TableFooter, TextField, Typography } from "@material-ui/core";

// import "./styles.css"

const tablelogoimg = {
  width: "100px",
  height: "100px",
  objectFit: "contain",
  display: "inline",
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

const useStyles = makeStyles({
  table: {
    // minWidth: 800
  }
});

const CssTextField = withStyles({
  root: {
    // '& label.Mui-focused': {
    //   color: 'white',
    // },
    // '& .MuiInput-underline:after': {
    //   borderBottomColor: 'yellow',
    // },
    // '& .MuiOutlinedInput-root': {
    //   '& fieldset': {
    //     borderColor: 'white',
    //   },
    //   '&:hover fieldset': {
    //     borderColor: 'white',
    //   },
    //   '&.Mui-focused fieldset': {
    //     borderColor: 'yellow',
    //   },
    // },
    "& .MuiOutlinedInput-input": {
      padding: "10px 14px"
    }
  },
})(TextField);


let firestoreData = firebase.firestore();

// let ListOfMOC = [];

let tempDataArray = [];

let lineStatus = ""


export default function GenerateInvoice({ selectedDocId, orderDetailsData }) {

  const classes = useStyles();

  let [basicDetails, setBasicDetails] = useState({});



  let [finalList, setFinalList] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(
    () => {

      setBasicDetails(orderDetailsData)

      tempDataArray = []
      orderDetailsData.itemList.map((val, index) => {
        tempDataArray.push({
          itemName: val.itemName,
          itemType: val.itemType,
          productQty: val.productQty,
          productPrice: val.productPrice,
          totalItemPrice: val.totalItemPrice
        })
      })
      setFinalList(tempDataArray);
      setTotalCost(parseFloat(orderDetailsData.orderTotalAmmount).toFixed(2))

      lineStatus = 'JAMA';

    },
    []
  );






  const handleDownloadRateSheet = () => {

    let tmpName = basicDetails.clientName;

    var element = document.getElementById('RateTbl')
    var opt = {
      // margin: [8, 8, 32, 8], // top, left, bottom, right
      margin: 0.5,
      filename: tmpName,
      pagebreak: { mode: 'avoid-all' },
      image: { type: "jpeg", quality: 0.99 },
      html2canvas: { scale: 1, imageTimeout: 0 },
      // jsPDF: { unit: "px", format: "A4", orientation: "portrait", hotfixes: ["px_scaling"] },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save();
  }





  return (
    <Container maxWidth="lg">
      {/* <h2 style={{ textAlign: "center" }}>Invoice</h2> */}

      <Grid container sm={12} md={12} direction="column">

        <Grid
          item
          sm={12}
          md={12}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          {/* <Button variant='contained' onClick={() => saveRateData()}>
            Save
          </Button> */}
          <Button variant='contained' style={{ marginLeft: '5px' }} onClick={() => handleDownloadRateSheet()}>
            Download
          </Button>
        </Grid>


        <Grid
          item
          sm={12}
          md={12}
          style={{
            display: 'block',
            margin: '40px'
          }}
        >
          <Table id='RateTbl' className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={8} style={{ backgroundColor: "transparent" }} align="center">
                  <img src={logodownload} alt='' style={tablelogoimg} />
                  <Typography variant='h5' style={{
                    color: "#000077",
                    fontFamily: ['Montserrat', 'sans-serif'].join(','),
                    fontWeight: 800
                  }}>Maa Annapurna Foods & Catering</Typography>

                  <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                    {/* <p style={{ fontSize: "16px", fontWeight: 500, margin: "12px", color: '#000077' }}>{'GST No. :: ' + '24AAQFN5101M1Z4'}</p> */}
                    <p style={{ fontSize: "16px", fontWeight: 500, margin: "12px", color: '#000077' }}>{'Contact No. :: ' + '+91 74050 57277'}</p>
                    {/* <p style={{ fontSize: "16px", fontWeight: 500, margin: "12px", color: '#000077' }}>{', ' + '+91 82388 88809'}</p> */}
                  </div>

                  <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, margin: "13px", color: '#000077' }}>{'Address :: ' + 'C24, Naxatra View Apt, Neae. L P Savani School, Palanpore Gaam, Surat. '}</p>
                  </div>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={8} style={{ backgroundColor: "transparent" }} align="center">
                  <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: "15px", margin: "13px", color: '#000000' }}>{'Invoice No. :: ' + basicDetails.invoiceNo}</p>
                    <p style={{ fontSize: "15px", margin: "13px", color: '#000000' }}>{'Name :: ' + basicDetails.clientName}</p>
                    <p style={{ fontSize: "15px", margin: "13px", color: '#000000' }}>{'Contact No. :: ' + basicDetails.clientContact}</p>
                    <p style={{ fontSize: "15px", margin: "13px", color: '#000000' }}>{'Date :: ' + new Date(basicDetails.order_date).toDateString()}</p>
                  </div>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}>Sr No</StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}>Item</StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}>Type</StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}>QTY</StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}>Rate</StyledTableCell>
                <StyledTableCell align="right" style={{ backgroundColor: "#000077" }}>Total</StyledTableCell>
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
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}>Total</StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}></StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}></StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}></StyledTableCell>
                <StyledTableCell align="left" style={{ backgroundColor: "#000077" }}></StyledTableCell>
                <StyledTableCell align="right" style={{ backgroundColor: "#000077" }}>{totalCost}</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={8} style={{ backgroundColor: "transparent" }} align="center">
                  <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>

                    {lineStatus === 'JAMA' &&
                      <p style={{ fontSize: "22px", margin: "15px", color: '#27a727' }}>{'PAID'}</p>
                    }

                    {lineStatus === 'BAKI' &&
                      <p style={{ fontSize: "22px", margin: "15px", color: '#a72727' }}>{'REST'}</p>
                    }
                  </div>
                </StyledTableCell>
              </TableRow>
            </TableHead>
          </Table>

        </Grid>
      </Grid>

    </Container>
  );
}
