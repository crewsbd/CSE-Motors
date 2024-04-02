// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");


router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

// Route to build account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Registration handlers
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Update account handlers
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
router.post(
  "/update",
  regValidate.updateRules(), // TODO: This needs to have a separate rule set, without existing email check..unless...oh complex
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
  );
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Messaging handlers
router.get("/messages", utilities.handleErrors(accountController.buildInbox));
router.get("/messages/:messageNumber", utilities.handleErrors(accountController.buildMessage));
router.get("/messages/:messageNumber/toggle-read", utilities.handleErrors(accountController.toggleRead));
router.get("/messages/:messageNumber/toggle-archived", utilities.handleErrors(accountController.toggleArchived));
router.get("/messages/:messageNumber/delete", utilities.handleErrors(accountController.deleteMessage));


module.exports = router;
