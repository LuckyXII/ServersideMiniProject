const customer = require("../models/customerRentalStatusModel");

function customerBooking(req,res) {
    //  make booking available by customer
    //  selectBtn will fetch data and POST to confirmation view
    //  check if a search is made, if not view shows message
    
    customer
            .find({
        "status.rented": {"startDate": null, "endDate": null}
        })
        .exec()
        .then((customers)=>{
            console.log(customers);
            let bookedCars = [];
            let vehicle = req.body.vehicle;
            customers.forEach((customer)=> {
                // DO Something!
            })
            return res;
        })
        .catch((err)=> {
            console.log(err);
        });
}

module.exports = {
    customerBooking: customerBooking
};