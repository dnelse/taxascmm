const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu();
const express = require('express');
const router = express.Router();




router.post("/", (req, res) => {

    const  {phoneNumber,sessionId ,serviceCode, text }=req.body;
    console.log('££££££££',req.body);
    let response="";


});