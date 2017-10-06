const customer = require("../models/customerRentalStatusModel");

function customerBooking(req,res) {
    //  make booking available by customer
    //  use fetch to get the correct values
    //  apply selectBtn 
    //  button click sends customer to confirmation view
    
            
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
    checkIfCustomerExist:checkIfCustomerExist
};