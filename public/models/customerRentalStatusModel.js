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
    rented:{
        type:Object,
        date:{
            type:Date,
            sparse: true
        },
        car: {
            type: Schema.Types.ObjectId,
            ref:"vehicle",
            unique:true,
            sparse: true
        },
        rentalPeriod:{
            type:Object,
            start: Date,
            end: Date,
            sparse: true

        },
        rentalCost:{
            type: Object,
            day: Number,
            total:Number,
            sparse: true

        },
        sparse: true
    }
});

module.exports = mongoose.model("customer", customerRentalStatusSchema);