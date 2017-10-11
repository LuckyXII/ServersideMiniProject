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
                    end: query.rentalPeriod.end
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
    customerBooking: customerBooking
};