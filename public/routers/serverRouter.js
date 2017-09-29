const
    express = require("express"),
    router = express.Router(),
    carController = require("../controllers/carModelController"),
    customerController = require("../controllers/customerModelController");

//default Route
router
    .get("/", carController.getAllCars)
    .post("/");

//Admin Route
router
    .get("/admin")
    .post("/admin");

//Confirmation Route
router
    .get("/confirmation")
    .post("/confirmation");

router
    .get("/date",carController.checkAvailableCarsByDate)
    .get("/date/*");

//Wildcard Route
router
    .get("/*",carController.getCarsByQuery)
    .post("/*");


module.exports = router;