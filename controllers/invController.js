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
    res.render("./inventory/classification", {
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

    res.render("./inventory/listing", {
        title: itemName,
        nav,
        listing,
    })
}

module.exports = invCont;