const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/**
 * Build inventory by classification view
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  /** @type {Array} */
  const data = await invModel.getInventoryByClassificationId(classification_id);

  let grid;
  let className;
  if (data.length) {
    grid = await utilities.buildClassificationGrid(data);
    className = data[0].classification_name;
  } else {
    grid = "";
    className = "No";
  }
  let nav = await utilities.getNav();

  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/**
 * Build the view to display a single vehicle
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  //const data = await invModel.getInventoryByInventoryId(inventoryId + 5); // Buggy code
  const data = await invModel.getInventoryByInventoryId(inventoryId); // Clean code
  const listing = await utilities.buildItemListing(data[0]);
  let nav = await utilities.getNav();
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`;

  res.render("inventory/listing", {
    title: itemName,
    nav,
    listing,
  });
};

/**********************************
 * Vehicle Management Controllers
 **********************************/

/**
 * Build the main vehicle management view
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    errors: null,
    nav,
    classificationSelect,
  });
};

/**
 * Build the add classification view
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};
/**
 * Handle post request to add a vehicle classification
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const response = await invModel.addClassification(classification_name); // ...to a function within the inventory model...
  let nav = await utilities.getNav(); // After query, so it shows new classification
  if (response) {
    req.flash(
      "notice",
      `The "${classification_name}" classification was successfully added.`
    );
    res.render("inventory/management", {
      title: "Vehicle Management",
      errors: null,
      nav,
      classification_name,
    });
  } else {
    req.flash("notice", `Failed to add ${classification_name}`);
    res.render("inventory/addClassification", {
      title: "Add New Classification",
      errors: null,
      nav,
      classification_name,
    });
  }
};

/**
 * Build the add inventory view
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();

  res.render("inventory/addInventory", {
    title: "Add Vehicle",
    errors: null,
    nav,
    classifications,
  });
};

/**
 * Handle post request to add a vehicle to the inventory along with redirects
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} successfully added.`
    );
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    // This seems to never get called. Is this just for DB errors?
    req.flash("notice", "There was a problem.");
    res.render("inventory/addInventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/**
 * Build the edit inventory view
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();

  const inventoryData = (
    await invModel.getInventoryByInventoryId(inventory_id)
  )[0]; // Change this function to return the first item
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  let classifications = await utilities.buildClassificationList();

  res.render("inventory/editInventory", {
    title: "Edit " + name,
    errors: null,
    nav,
    classifications,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description,
    inv_image: inventoryData.inv_image,
    inv_thumbnail: inventoryData.inv_thumbnail,
    inv_price: inventoryData.inv_price,
    inv_miles: inventoryData.inv_miles,
    inv_color: inventoryData.inv_color,
    classification_id: inventoryData.classification_id_id,
  });
};

/**
 * Handle post request to update a vehicle to the inventory along with redirects
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    const itemName = response.inv_make + " " + response.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classifications = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      classifications: classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont;
