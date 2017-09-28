//=======================================================
//IMPORTS
const car = require("../models/carModel");

//=======================================================
//GLOBALS
const searchBtn = document.getElementById("searchBtn");
const dateStart = document.getElementById("dateForm").children[0];
const dateEnd = document.getElementById("dateForm").children[1];
//=======================================================
//CLASSES

//=======================================================
//MAIN

//=======================================================
//LISTENERS
searchBtn.addEventListener("click",checkAvailabillityByQuery);
dateStart.addEventListener("change",checkAvailabillityByDate);
dateStart.addEventListener("change",checkAvailabillityByDate);
//=======================================================
//FUNCTIONS

function checkAvailabillityByQuery(e){
    e.preventDefault();
    const dateStartValue = dateStart.valueAsDate;
    const dateEndValue = dateEnd.valueAsDate;
    //TODO add rest of input data, make query and filter cars

}

function checkAvailabillityByDate(e){
    console.log(e);
    

}