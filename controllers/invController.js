const { request } = require("express")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/**
 * Build inventory by classification view
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}
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
    })
}
// Management controllers


invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
        title: "Inventory Management",
        errors: null,
        nav,
    })
}

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();

    res.render("inventory/addClassification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

invCont.addClassification = async function(req, res, next) {
    
    const {classification_name} = req.body;

    const response = await invModel.addClassification(classification_name); // ...to a function within the inventory model... 
    let nav = await utilities.getNav(); // After query, so it shows new classification
    if(response) {
        req.flash("notice", `${classification_name} successfully added.`);
        res.render("inventory/addClassification", {
            title: "Add Classification",
            errors: null,
            nav,
            classification_name
        });
    }
    else {
        req.flash("notice", `Failed to add ${classification_name}`);
        res.render("inventory/addClassification", {
            title: "Add Classification",
            errors: null,
            nav,
            classification_name
        })
    }
}

invCont.buildAddInventory = async function(req, res, next) {
    const nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList();

    res.render("inventory/addInventory", {
        title: "Add Inventory",
        errors: null,
        nav,
        classifications
    }
    );
}

invCont.addInventory = async function(req, res, next) {
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
        classification_id);

    if(response) {
        req.flash("notice", `${inv_year} ${inv_make} ${inv_model} successfully added.`);
        res.render("inventory/management", {
            title: "Management",
            nav,
            errors: null,

        })
    }
    else {  // This seems to never get called. Is this just for DB errors?
        req.flash("notice", "There was a problem.")
        res.render("inventory/addInventory", {
            title: "Add Inventory",
            nav,
            errors: null,
        })
    }

}

module.exports = invCont;