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

function checkAvailableCarsByDate(req,res){
    let query = req.query,
        startDate = dateParser(query.startDate),
        endDate = dateParser(query.endDate);
    //TODO check if date is less or more than rent date, account for null value
    car
        .find({
            "status.isAvailable":true,
        })
        .exec()
        .then((cars)=>{
            //console.log(res);
            //console.log(cars);

            let carsAfterSort = [];
            cars.forEach((car)=>{
                let carInDbStartDate = dateParser(car.status.rented.startDate),
                    carInDbEndDate = dateParser(car.status.rented.endDate);

                //Check bools and values
                /*console.log(car.model + " : " + (carInDbStartDate > endDate));
                console.log(carInDbStartDate + " : " + endDate);
                console.log(car.model + " : " + (carInDbEndDate < startDate));
                console.log(carInDbEndDate + " : " + startDate);
                console.log(car.model + " : " + (carInDbStartDate !== null));*/
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