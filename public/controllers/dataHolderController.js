const dataHolder = require("../models/resultDataHolderModel");
/*
function checkAvailableCarsByQuery(req,res){
    //TODO I have saved car IDs but is querying by cathegory, needs to fix
    //Maybe sort in car module and check if ID is in carholder array instead
    let query = req.query;
    let obj = {};

    //find queries used
    for(let prop in query){
        obj[prop] = query[prop];
    }
    dataHolder
        .find(obj)
        .exec()
        .then((cars)=>{
            console.log(cars);
            res.json(cars);
            
            return cars;
        })
        .catch((err)=>{
            console.log(err);
        });
}


module.exports = {
    checkAvailableCarsByQuery : checkAvailableCarsByQuery
};

*/