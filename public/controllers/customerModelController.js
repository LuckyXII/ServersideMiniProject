const
    customer = require("../models/customerRentalStatusModel"),
    car = require("../models/carModel");


function cancelBooking(req,res){
    console.log(req.method);
    let query = req.query;
    let id = query.carId;
    console.log();
    customer
        .updateOne({"personnr":query.personnr},{
            $set: {
                rented:null
            }
        },{upsert:false})
        .exec()
        .then((result)=>{
            console.log("REMOVE BOOKING: " + JSON.stringify(result));
            res.json(result);
        })
        .catch((err)=> {
            console.log(err);
        });

    console.log(id);
    car
        .updateOne({"_id":id},{
            $pop:{
                "status.rented":1
            }
        })
        .exec()
        .then((result)=>{
            console.log("REMOVE BOOKING FROM CAR: " + JSON.stringify(result));
        })
        .catch((err)=> {
            console.log(err);
        });
}

function customerBooking(req,res) {
    
    console.log(req.method);
    let query = req.query;
    let id = query.car;
    customer
        .updateOne({"personnr":query.logedIn},{
            $set: {
                rented:{
                    "date":query.date,
                    "car":query.car,
                    rentalPeriod:{
                        start: query.rentalPeriodStart,
                        end: query.rentalPeriodEnd
                    },
                    rentalCost:{
                        day:query.rentalCostDay,
                        total: query.rentalCostTotal
                    }
                }
            }

        },{upsert:false})
        .exec()
        .then((result)=>{
            console.log("BOOK CAR: " + JSON.stringify(result));
            res.json(result);
        })
        .catch((err)=> {
            console.log(err);
        });
    
    console.log(id);
    car
        .updateOne({"_id":id},{
            $push:{
                "status.rented":{
                    start: query.rentalPeriodStart,
                    end: query.rentalPeriodEnd
                }
            }
        })
        .exec()
        .then((result)=>{
            console.log("UPDATE CAR: " + JSON.stringify(result));
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
    
    new customer({
        "name":name,
        "personnr":personnr,
        "rented":{}
    }).save((err)=>{
        if(err!==null){
            console.log("customer save error: " + err);
        }else{
            res.json({saved:true,name:name});
        }
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
            if(customer.length > 0){
                res.json(customer[0]);
            }else{
                res.json(customer);
            }
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
            console.log("getAllCustomers" + customer)
            res.json(customer);
        })
        .catch((err)=>{
            console.log(err);
        });
}


module.exports = {
    getAllCustomers : getAllCustomers,
    getCustomersByQuery: getCustomersByQuery,
    createUser: createUser,
    checkIfCustomerExist:checkIfCustomerExist,
    customerBooking: customerBooking,
    cancelBooking : cancelBooking
};