const
    express = require("express"),
    router = express.Router(),
    carController = require("../controllers/carModelController"),
    customerController = require("../controllers/customerModelController");

//default Route
router
    .get("/", carController.getAllCars)
    .post("/", customerController.customerBooking);

//update
router
    .get("/update/cancelBooking", customerController.cancelBooking);

//Admin Route
router
    .get("/admin",carController.getAllCarsAdmin)
    .get("/admin/delete", carController.deleteCars)
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
    .get("/login/createNewUser",customerController.createUser);


//Wildcard Route //TODO error route 404
/*
router
    .get("/!*",carController.getCarsByQuery)
    .post("/!*");
*/


module.exports = router;