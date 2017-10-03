const
    car = require("../models/carModel"),
    /*index = require("../views/index"),*/
    resultDataHolder = require("../models/resultDataHolderModel");


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

//finds matching cars by url queries
function getCarsByQuery(req, res){
    let query = req.query;
    car
        .find({query})
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
            //console.log(dateResult);
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
                    //console.log("CARS: "+cars);
                    res.render("result",{
                        result:cars
                    });
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
    checkAvailableCarsByQuery: checkAvailableCarsByQuery

};