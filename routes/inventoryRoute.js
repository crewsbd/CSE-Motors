// Needed Resources 
const express = require("express");
const router = new express.Router() ;
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Classification management routes
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification)); // ...through the appropriate router, where server-side validation middleware is present,... 

// Inventory management routes
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory));

// AJAX inventory api call route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Build edit inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventory));

//  Update vehicle information route
router.post("/update/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));


module.exports = router;