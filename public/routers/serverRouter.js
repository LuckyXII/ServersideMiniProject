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
    .get("/admin")
    .post("/admin");

//Confirmation Route
router
    .get("/confirmation", customerController.customerBooking)
    .post("/confirmation");

//date API
router
    .get("/date",carController.checkAvailableCarsByDate)
    .get("/date/*");

router
    .get("/result", carController.checkAvailableCarsByQuery)
    .get("/result/*");

//Wildcard Route
/*
router
    .get("/!*",carController.getCarsByQuery)
    .post("/!*");
*/


module.exports = router;