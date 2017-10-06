const mongoose = require("mongoose"),
    Schema = mongoose.Schema;


const customerRentalStatusSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    personnr:{
        type:Number,
        unique:true,
        required:"person nummer is required"
    },
    date:{
        type:Date,
    },
    car: {
        type: Schema.Types.ObjectId,
        ref:"vehicle",

        unique:true
    },
    rentalPeriod:{
        type:Object,
        start: Date,
        end: Date,

    },
    rentalCost:{
        type: Object,
        day: Number,
        total:Number,

    }
});

module.exports = mongoose.model("customer", customerRentalStatusSchema);