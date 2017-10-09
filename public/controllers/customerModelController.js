const customer = require("../models/customerRentalStatusModel");

function customerBooking(req,res) {
    //  make booking available by customer
    //  selectBtn will fetch data and POST to confirmation view
    //  check if a search is made, if not view shows message
    let query = req.query;

    customer
        .updateOne({"personnr":query.logedIn},{
            rented: {$set:{
                date:query.date,
                car:query.car,
                rentalPeriod:{
                    start: query.rentalPeriod.start,
                    end: query.rrentalPeriod.end
                },
                rentalCost:{
                    day:query.rentalCost.day,
                    total: query.rentalCost.total
                }
            }}
        },{upsert:false})
        .exec()
        .then((result)=>{
            console.log(result);
            res.json(result);
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