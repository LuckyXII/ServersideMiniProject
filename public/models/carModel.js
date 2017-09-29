const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    reqLicense: String,
    fordonstyp:String,
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
    dagsHyra: {
        type:Number,
        required: "dagshyra is required"
    },
    fuel: String,
    imgLink: String,
    kommentarer: {
        skador: String
    },
    status:{
        isAvailable: Boolean,
        rented:{
            startDate: {type:Date,min: new Date().getTime()},
            endDate:Date
        }
    }
});

module.exports = mongoose.model("vehicle", carSchema);
