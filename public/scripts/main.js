//=======================================================
//GLOBALS
const
    searchBtn = document.getElementById("searchBtn"),
    dateStart = document.getElementById("dateForm").children[0],
    dateEnd = document.getElementById("dateForm").children[1];

var dateStartValue, dateEndValue;
//=======================================================
//CLASSES


//=======================================================
//MAIN

//=======================================================
//LISTENERS
searchBtn.addEventListener("click",checkAvailabillityByQuery);
dateStart.addEventListener("change",checkAvailabillityByDate);
dateEnd.addEventListener("change",checkAvailabillityByDate);
//=======================================================
//FUNCTIONS

function checkAvailabillityByQuery(e){
    e.preventDefault();
    const dateStartValue = dateStart.valueAsDate;
    const dateEndValue = dateEnd.valueAsDate;

    //TODO add rest of input data, make query and filter cars

}

function checkAvailabillityByDate(e){
    dateStartValue = dateStart.valueAsDate;
    dateEndValue = dateEnd.valueAsDate;

    if(dateEndValue === null && dateStartValue !== null){
        //TODO show status message that an end date must be selected
    }
    else if(dateEndValue !== null && dateStartValue === null){
        //TODO show status message that a start date must be seected
    }
    else if(dateEndValue !== null && dateStartValue !== null){
        findByQuery(`startDate=${dateStartValue}&endDate=${dateEndValue}`);
    }

}


function findByQuery(query=""){

    fetch(`olssonsfordonab/date/?${query}`)
        .then((response)=> {
            return response.text();
        })
        .then((result)=> {
            console.log(result);
            //TODO show results in view
        })
        .catch((err)=>{
            console.log(err);
        });

}

function restrictPassedDate(){
    //TODO get current date in html5 format and set a min property on the date inputs
}
/*
db.vehicles.updateMany(
    {
        brand:"Volvo"
    },
    {
        $set:{
            "status.rented.startDate":new Date("2017-09-02")
        }
    }
);*/
