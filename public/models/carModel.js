const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    reqLicense: String,
    fordonstyp:{
        type:String,
        required: true
    },
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
        required: true
    },
    fuel: String,
    imgLink: String,
    kommentarer: {
        skador: String
    },
    status:{
        isAvailable:{
            type: Boolean,
            required: true
        },
        rented:[
            {
                startDate: String,
                endDate: String
            }
        ]
    }
});

module.exports = mongoose.model("vehicle", carSchema);
