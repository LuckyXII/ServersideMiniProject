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
restrictPassedDate();
//=======================================================
//LISTENERS
searchBtn.addEventListener("click",checkAvailabillityByQuery);
dateStart.addEventListener("change",checkAvailabillityByDate);
dateEnd.addEventListener("change",checkAvailabillityByDate);
//=======================================================
//FUNCTIONS

function checkAvailabillityByQuery(e){
    e.preventDefault();

    //TODO add rest of input data, make query and filter cars

}

function checkAvailabillityByDate(e){
    dateStartValue = dateStart.value;
    dateEndValue = dateEnd.value;

    if((dateEndValue === null || dateEndValue === "") &&
        (dateStartValue !== null)){
        //TODO show status message that an end date must be selected
        //prevent end from being smaller than start
        dateEnd.min = dateStartValue;
    }
    else if(dateEndValue !== null &&
        (dateStartValue === null || dateStartValue === null)){
        //TODO show status message that a start date must be seected
    }
    else if(dateEndValue !== null && dateStartValue !== null){
        findByQuery(`startDate=${dateStartValue}&endDate=${dateEndValue}`);
    }

}


function findByQuery(query=""){

    fetch(`olssonsfordonab/date/?${query}`)
        .then((response)=> {
            console.log(response);
            return response.text();
        })
        .then((result)=> {
            console.log("SUCESS!!" + result);
        })
        .catch((err)=>{
            console.log(err);
        });

}

function restrictPassedDate(){
    //TODO get current date in html5 format and set a min property on the date inputs
    let date = new Date(),
        day = date.getDate(),
        month = date.getMonth()+1,
        year = date.getFullYear();
    if(day < 10){
        day = `0${day}`;
    }
    if(month < 10){
        month = `0${month}`;
    }
    dateStart.min = `${year}-${month}-${day}`;
    dateEnd.min = `${year}-${month}-${day}`;
}
