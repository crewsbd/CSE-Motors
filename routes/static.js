const express = require("express");
const router = express.Router();
const utilities = require("../utilities")

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", utilities.handleErrors(express.static(__dirname + "public/css")));
router.use("/js", utilities.handleErrors(express.static(__dirname + "public/js")));
router.use("/images", utilities.handleErrors(express.static(__dirname + "public/images")));

module.exports = router;



