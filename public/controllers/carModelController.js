const
    car = require("../models/carModel"),
    resultDataHolder = require("../models/resultDataHolderModel"),
    ObjectId = require('mongodb').ObjectId;
    
// update cars as admin
function updateCars(req,res) {
    let id = req.query.id,
        ID = new ObjectId(id)
    car
    .updateOne({"_id":ID}, {
        requiredDrivingLicense: req.query.reqLicense,
    fordonstyp:{
        type:req.query.fordon,
        required: true
    },
    brand:{
        type:req.query.brand,
        required:true
    },
    model:{
        type:req.query.model,
        required:true
    },
    year: req.query.year,
    gearbox:req.query.gearbox,
    dagshyra: {
        type:req.query.dagshyra,
        required: true
    },
    fuel: req.query.fuel,
    imgLink: req.query.image,
    kommentarer: {
        skador: req.query.skador
    },
    status:{
        isAvailable:{
            type: req.query.isAvailable,
            required: true
        }
        
    }}, {upsert:false})
    .exec()
    .then((result)=>{
        console.log(result)
        res.json(result)
    })
    .catch((err)=>{
        console.log(err)
    })
}
// get all cars from database to index view
function getAllCars(req,res){
    car
        .find({})
        .exec()
        .then((cars)=>{
            //console.log(cars);
            res.render("index",{
                content: cars
            });
            //TODO Add view file, replace BLOCKNAME
        })
        .catch((err)=>{
            console.log(err);
        });
}

function getAllCarsAdmin(req,res){
    car
        .find({})
        .exec()
        .then((cars)=>{
            console.log(cars);
            res.render("admin",{
                content: cars
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
            //console.log(cars);
            res.render("index",{
                content:cars
            });
            //TODO Add view file, replace BLOCKNAME
        })
        .catch((err)=>{
            console.log(err);
        });
}

//find cars that are available between selected dates
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
                //TODO when rented dates is array isert nested loop for date parsing
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
                    //console.log( typeof cars);
                    //TODO append results in resultDiv
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
    checkAvailableCarsByQuery: checkAvailableCarsByQuery,
    getAllCarsAdmin:getAllCarsAdmin,
    updateCars: updateCars

};