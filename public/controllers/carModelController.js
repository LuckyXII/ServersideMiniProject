const car = require("../models/carModel");


function getAllCars(req,res){
    car
        .find({})
        .exec()
        .then((cars)=>{
            //console.log(cars);
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

//find cars that are available between selected dates
function checkAvailableCarsByDate(req,res){
    let query = req.query,
        startDate = dateParser(query.startDate),
        endDate = dateParser(query.endDate);
    //find cars
    car
        .find({
            "status.isAvailable":true,
        })
        .exec()
        .then((cars)=>{
            let carsAfterSort = [];
            cars.forEach((car)=>{
                let carInDbStartDate = dateParser(car.status.rented.startDate),
                    carInDbEndDate = dateParser(car.status.rented.endDate);

                if(
                    (carInDbStartDate > endDate && carInDbEndDate > endDate && carInDbStartDate !== null)  ||
                    (carInDbEndDate < startDate && carInDbStartDate < startDate && carInDbStartDate !== null)
                    //TODO allow null later for unrented/unreserved cars
                ){  
                    //console.log(car);
                    carsAfterSort.push(car);
                }
            });
            res.json(carsAfterSort);
            //TODO send data to view
            return res;
        })
        .catch((err)=>{
            console.log(err);
        });
}


//===================================================
//Developer Methods

function dateParser(date){
    if(date === null){return null;}
    return new Date(date);
}

//=====================================================



module.exports = {
    getAllCars:getAllCars,
    getCarsByQuery:getCarsByQuery,
    checkAvailableCarsByDate: checkAvailableCarsByDate,

};