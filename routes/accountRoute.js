// Needed Resources 
const express = require("express");
const router = new express.Router() ;
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Route to build account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/registration", utilities.handleErrors(accountController.buildRegister));

module.exports = router;