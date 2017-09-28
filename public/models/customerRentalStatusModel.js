const mongoose = require("mongoose"),
    Schema = mongoose.Schema;


const customerRentalStatusSchema = new Schema({
    name:{
        first: String,
        last: String,
        required: "name is required",
    },
    personr:{
        type:Number,
        unique:true,
        required:"person nummer is required"
    },
    date:{
        type:Date,
        required: "date is required"
    },
    car: {
        type: Schema.Types.ObjectId,
        ref:"vehicle",
        required: "car id is required",
        unique:true
    },
    rentalPeriod:{
        start: Date,
        end: Date,
        required: "a period must exist"
    },
    rentalCost:{
        day: Number,
        total:Number,
        required: "cost is required"
    }
});

module.exports = mongoose.model("customer", customerRentalStatusSchema);