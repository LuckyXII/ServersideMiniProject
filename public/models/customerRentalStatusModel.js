const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    reqLicense: String,
    brand:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    },
    year: Number,
    gearbox:String,
    cost: Number,
    isAvailable: Boolean

});

module.exports = mongoose.model("vehicle", carSchema);
/*

    "year" : 2005,
    "gearbox" : "manuell",
    "dagshyra" : 498,
    "imgLink" : "https*/://upload.wikimedia.org/wikipedia/commons/e/ea/Volvo_V50_--_04-20-2010.jpg"