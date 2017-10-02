const
    car = require("../models/carModel"),
    resultDataHolder = require("../models/resultDataHolderModel");


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
        console.log(cars);
            let carsAfterSort = [];
            let carIdsAfterSort = [];
            cars.forEach((car)=>{
                //TODO when rented dates is array isert nested loop for date parsing
                let carInDbStartDate = dateParser(car.status.rented.startDate),
                    carInDbEndDate = dateParser(car.status.rented.endDate);

                //check valid values
                if(
                    (carInDbStartDate > endDate && carInDbEndDate > endDate && carInDbStartDate !== null)  ||
                    (carInDbEndDate < startDate && carInDbStartDate < startDate && carInDbStartDate !== null)
                    //TODO allow null later for unrented/unreserved cars
                ){  
                    //console.log(car);
                    carsAfterSort.push(car);
                    carIdsAfterSort.push(car._id);
                }
            });
            
            res.json(carsAfterSort);
            //Send result to dataHolder collection
            let dateResult = new resultDataHolder({
                identifier: "resultAfterDateQuery",
                query:[{isAvailable:true},{startDate:startDate},{endDate:endDate}],
                result:carIdsAfterSort
            });
            dateResult.save((err)=>{
                console.log("Save Error: " + err);
            });
            return res;
        })
        .catch((err)=>{
            console.log(err);
        });
}


//===================================================
//Developer Methods

//Turn string dates YYYY-MM-DD in to date object
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