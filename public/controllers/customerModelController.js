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
            });
            return res;
        })
        .catch((err)=> {
            console.log(err);
        });
}

function createUser(req,res){
    let
        query = req.query,
        name = query.name,
        personnr=query.personnr;
    
    let newCustomer = new customer({
        "name":name,
        "personnr":personnr
    });
    
    newCustomer.save((err)=>{
        console.log("customer save error: " + err);
    });
        
}

function checkIfCustomerExist(req,res){
    let personnr = Number(req.query.personnr);
    console.log("personnr: " + JSON.stringify(personnr));
    customer
        .find({"personnr":personnr})
        .exec()
        .then((customer)=>{
            console.log(customer);
            res.json(customer[0]);
        })
        .catch((err)=>{
            console.log(err);
        });
}

function getCustomersByQuery(req,res){
    let query = req.query;
    console.log("query: " + JSON.stringify(query));
    customer
        .find({query})
        .exec()
        .then((customer)=>{
        console.log(customer);
            res.json(customer);
        })
        .catch((err)=>{
            console.log(err);
        });
}


function getAllCustomers(req,res){
    customer
        .find({})
        .exec()
        .then((customer)=>{
            res.json(customer);
        })
        .catch((err)=>{
            console.log(err);
        });
}

function login(req,res){

}

module.exports = {
    login:login,
    getAllCustomers : getAllCustomers,
    getCustomersByQuery: getCustomersByQuery,
    createUser: createUser,
    checkIfCustomerExist:checkIfCustomerExist,
    customerBooking: customerBooking
};