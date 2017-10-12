const
    express = require("express"),
    router = express.Router(),
    carController = require("../controllers/carModelController"),
    customerController = require("../controllers/customerModelController"),
    dataHolderController = require("../controllers/dataHolderController");

//default Route
router
    .get("/", carController.getAllCars)
    .post("/", customerController.customerBooking);

//Admin Route
router
    .get("/admin",carController.getAllCarsAdmin)
    .get("/admin/delete")
    .get("admin/update", carController.updateCars)
    .post("/admin");

//Confirmation Route
router
    .get("/confirmation", customerController.customerBooking)
    .post("/confirmation");

//date API
router
    .get("/date",carController.checkAvailableCarsByDate)
    .get("/date/*");

//Result
router
    .get("/result", carController.checkAvailableCarsByQuery)
    .get("/result/*");

//Login
router
    .get("/login", customerController.checkIfCustomerExist)
    .get("/login/createNewUser",customerController.createUser)
    .get("/login/*");


//Wildcard Route
/*
router
    .get("/!*",carController.getCarsByQuery)
    .post("/!*");
*/


module.exports = router;