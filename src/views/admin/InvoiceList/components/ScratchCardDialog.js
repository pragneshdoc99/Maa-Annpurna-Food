// src/components/ScratchCardDialog.js
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import ScratchCard from 'react-scratchcard';
import scratchme from "../../../../assets/img/scratch/scratchme.png";
import './ScratchCardDialog.css';
import firebase from '../../../../firebase';

const ScratchCardDialog = ({ open, onClose, discountPersent, orderDetailsData }) => {

  useEffect(() => {
    // console.log("discountPersent :: ", discountPersent);
    // console.log("orderDetailsData :: ", orderDetailsData);
  }, []);

  const settings = {
    width: 320,
    height: 180,
    image: scratchme,
    finishPercent: 50,
    onComplete: () => {
      // alert('You won!');
      addScratchUserDetails()
    }
  };

  const addScratchUserDetails = () => {
    let tmpUserId = localStorage.getItem('userId');
    let tmpEmail = localStorage.getItem('email');

    const detailObj = {
      clientName: orderDetailsData.clientName,
      clientContact: orderDetailsData.clientContact,
      invoiceNo: orderDetailsData.invoiceNo,
      order_date: orderDetailsData.order_date,
      orderTotalAmmount: orderDetailsData.orderTotalAmmount,
      discountPersent: parseFloat(discountPersent),
      isScratched: true,
      userId: tmpUserId,
      userEmail: tmpEmail,
      isCardUsed: false
    }

    console.log("detailObj :: ", detailObj);

    let firestoreData = firebase.firestore();
    firestoreData.collection("user-scratched-offer-list").add(detailObj).then((docRef) => {
      // onClose();
      console.log("DATA ADDED")
    })

  }



  return (
    // <Dialog open={open} onClose={onClose}>
    <Dialog open={open}>
      <DialogTitle className="scratch-card-title">Scratch Card</DialogTitle>
      <DialogContent style={{ overflow: "hidden", padding: "20px 24px" }} className="scratch-card-content">
        <ScratchCard {...settings}>
          <div className="scratch-card-result">
            Congratulations! You got a discount of {discountPersent}%.
          </div>
        </ScratchCard>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScratchCardDialog;
