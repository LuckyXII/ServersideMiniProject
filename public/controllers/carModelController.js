const car = require("../models/carModel");


function getAllCars(req,res){
    car
        .find({})
        .exec()
        .then((cars)=>{
            console.log(cars);
            res.render("PUGNAME",{
                BLOCKNAME:cars
            });
            //TODO Add view file, replace PUGNAME and BLOCKNAME
        })
        .catch((err)=>{
            console.log(err);
        });
}

function getCarsByQuery(req, res){
    let query = req.query;
    car
        .find({query})
        .exec()
        .then((cars)=>{
            console.log(cars);
            res.render("PUGNAME",{
                BLOCKNAME:cars
            });
            //TODO Add view file, replace PUGNAME and BLOCKNAME
        })
        .catch((err)=>{
            console.log(err);
        });
}






module.exports = {
    getAllCars:getAllCars,
    getCarsByQuery:getCarsByQuery,

};