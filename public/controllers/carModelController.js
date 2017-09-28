const car = require("../models/carModel");


function getAllCars(req,res){
    car
        .find({})
        .exec()
        .then((cars)=>{
            console.log(cars);
            res.render("index",{
                BLOCKNAME:cars
            });
            //TODO Add view file, replace BLOCKNAME
        })
        .catch((err)=>{
            console.log(err);
        });
}

//finds matching cars by url queries
function getCarsByQuery(req, res){
    let query = req.query;
    car
        .find({query})
        .exec()
        .then((cars)=>{
            console.log(cars);
            res.render("index",{
                BLOCKNAME:cars
            });
            //TODO Add view file, replace BLOCKNAME
        })
        .catch((err)=>{
            console.log(err);
        });
}

function checkAvailableCarsByDate(req,res){
    let query = req.query;
    //TODO check if date is less or more than rent date, account for null value
    car
        .find({
            "status.isAvailale":true,
            "status.rented.startDate": {
                $lt: query.startDate,
                $ne: null
            },
            "staus.rented.endDate":{
                $gt: query.endDate,
                $ne: null
            }

        })
        .exec()
        .then((res)=>{
            console.log(res);
            return res;
        })
        .catch((err)=>{
            console.log(err);
        });
}


module.exports = {
    getAllCars:getAllCars,
    getCarsByQuery:getCarsByQuery,

};