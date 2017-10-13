const
    car = require("../models/carModel"),
    resultDataHolder = require("../models/resultDataHolderModel"),
    ObjectId = require('mongodb').ObjectId;

//delete car
function deleteCars(req, res){
    let
        id = req.query.id,
        ID = new ObjectId(id);
    car
        .deleteOne({"_id": ID})
        .exec()
        .then((result)=>{
            console.log(result);
        })
        .catch((err)=>{
            console.log(err);
        });
}

    
// update cars as admin
function updateCars(req,res) {
	console.log("inne i updateCars");
    let id = req.query.id,
        ID = new ObjectId(id);
		console.log(req.query);
    car
        .updateOne({"_id":ID}, {
            $set:{
                "requiredDrivingLicense": req.query.reqLicense,
                "fordonstyp":req.query.fordonstyp,
                "brand":req.query.brand,
                "model": req.query.model,
                "year": req.query.year,
                "gearbox":req.query.gearbox,
                "dagshyra":req.query.dagsHyra,
                "fuel": req.query.fuel,
                "kommentarer.skador":req.query.skador,
                "status.isAvailable":req.query.isAvailable
        }}, {upsert:true})
        .exec()
        .then((result)=>{
            console.log("update car status: "+JSON.stringify(result));
            res.json(result);
        })
        .catch((err)=>{
            console.log("update car error");
            console.log(err);
        });
}

//TODO should all cars be visible before date sort?
// get all cars from database to index view
function getAllCars(req,res){
    car
        .find({})
        .exec()
        .then((cars)=>{
            res.render("index",{
                content: cars
            });
        })
        .catch((err)=>{
            console.log(err);
        });
}

//get all cars and send to admin page
function getAllCarsAdmin(req,res){
    car
        .find({})
        .exec()
        .then((cars)=>{
            //console.log(cars);
            res.render("admin",{
                content: cars
            });
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
            //console.log(cars);
            res.render("index",{
                content:cars
            });
        })
        .catch((err)=>{
            console.log(err);
        });
}

//find cars that are available between selected dates
/*
*dateParser is middleware that parses selected date and date in Database to
* type Date so that they can be compared
*/
function checkAvailableCarsByDate(req,res){

    //reset dataholder
    resultDataHolder
        .deleteOne({"identifier": "resultAfterDateQuery"})
        .exec((err,res)=>{
            if(err){
                console.log(err);   
            }
            console.log("deletedCount: " + res.deletedCount);
        });

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
        //console.log(cars);
            let carsAfterSort = [];
            let carIdsAfterSort = [];
            cars.forEach((car)=>{
                let rentedArray = car.status.rented;
                let dateOccupied = [];

                //Go through all rented dates
                rentedArray.forEach((date)=>{
                    let carInDbStartDate = dateParser(date.startDate),
                        carInDbEndDate = dateParser(date.endDate);
                    
                    //check valid values
                    if(
                        (carInDbStartDate > endDate && carInDbEndDate > endDate && carInDbStartDate !== null)  ||
                        (carInDbEndDate < startDate && carInDbStartDate < startDate && carInDbStartDate !== null)
                        //TODO allow null later for unrented/unreserved cars
                    ){
                        dateOccupied.push(false);
                    }else{
                        dateOccupied.push(true);
                    }
                });

                //Find if any dates overlap
                let occupied = dateOccupied.find((found)=>{return found === true;});
                if(!occupied){
                    //console.log(car);
                    carsAfterSort.push(car);
                    carIdsAfterSort.push(car._id);
                }

            });

            res.json(carsAfterSort);
            console.log('carsAfterSort', carsAfterSort)
            //Send result to dataHolder collection
            let dateResult = new resultDataHolder({
                identifier: "resultAfterDateQuery",
                query:[{isAvailable:true},{startDate:startDate},{endDate:endDate}],
                result:carIdsAfterSort
            });
            
            dateResult.save((err)=> {
                if (err){
                    console.log("Save Error: " + err);
                }
            });
            return res;
        })
        .catch((err)=>{
            console.log(err);
        });
}

//find available cars by any query
function checkAvailableCarsByQuery(req,res){

    let query = req.query;
    let obj = {};

    //find queries used
    for(let prop in query){
        obj[prop] = query[prop];
    }

    //find all _id's in dataholders resultAfterDateQuery
    resultDataHolder
        .find({"identifier": "resultAfterDateQuery"})
        .exec()
        .then((dataHolder)=>{
            //save all _id's in query object
            obj._id = {$in:dataHolder[0].result};

            car
                .find(obj)
                .exec()
                .then((cars)=>{
                   //console.log("CARS: " + cars);
                    res.json(cars);
                })
                .catch((err)=>{
                    console.log(err);
                });

        })
        .catch((err)=>{
            console.log(err);
        });

}


//===================================================
//Middleware Methods

//Turn string dates YYYY-MM-DD in to date object
function dateParser(date){
    if(date === null){return null;}
    return new Date(date);
}

//=====================================================


//Exports
module.exports = {
    getAllCars:getAllCars,
    getCarsByQuery:getCarsByQuery,
    checkAvailableCarsByDate: checkAvailableCarsByDate,
    checkAvailableCarsByQuery: checkAvailableCarsByQuery,
    getAllCarsAdmin:getAllCarsAdmin,
    deleteCars : deleteCars,
    updateCars: updateCars


};