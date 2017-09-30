const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const resultDataHolderSchema = new Schema({
    query: Array,
    identifier:{
        type: String,
        unique:true
    },
    result: {
        type:[Schema.Types.ObjectId],
        required:true
    },

});

module.exports = mongoose.model("resultDataHolder",resultDataHolderSchema);