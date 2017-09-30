//=======================================================
//GLOBALS
const
    URL_BASE = "olssonsfordonab/",
    searchBtn = document.getElementById("searchBtn"),
    dateStart = document.getElementById("dateForm").children[0],
    dateEnd = document.getElementById("dateForm").children[1],
    selectVehicleType = document.getElementById("vehicleType"),
    selectBrand = document.getElementById("brand"),
    selectModel = document.getElementById("model"),
    selectGearbox = document.getElementById("gearbox");

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

function checkAvailabillityByDate(){
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
        dateStart.max = dateEndValue;
    }
    else if(dateEndValue !== null && dateStartValue !== null){
        findByQuery("date",`startDate=${dateStartValue}&endDate=${dateEndValue}`,findUniquePropertyValue);
    }

}


function findByQuery(router,query="",callback){

    fetch(`${URL_BASE}${router}/?${query}`)
        .then((response)=> {
            //console.log(response);
            return response.json();
        })
        .then((result)=> {
            console.log("date query was sucessfull");
            callback(result);
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

function uniqesOnly(value, index, self){
    return self.indexOf(value) === index;
}

function addOption(value,parent){
    let option = document.createElement("option");
    option.textContent = value;
    parent.appendChild(option);
}

function findUniquePropertyValue(result){
    //find all unique property values
    let gearBoxes = [],
        brands = [],
        models = [],
        vehicleTypes = [];

    result.forEach((car)=>{
        gearBoxes.push(car.gearbox);
        brands.push(car.brand);
        models.push(car.model);
        vehicleTypes.push(car.fordonstyp);
    });

    //save all unique property values in array
    brands = brands.filter(uniqesOnly);
    models = models.filter(uniqesOnly);
    vehicleTypes = vehicleTypes.filter(uniqesOnly);
    gearBoxes = gearBoxes.filter(uniqesOnly);

    //create options for select elements
    brands.forEach((value)=>{
        addOption(value,selectBrand);
    });
    models.forEach((value)=>{
        addOption(value,selectModel);
    });
    vehicleTypes.forEach((value)=>{
        addOption(value,selectVehicleType);
    });
    gearBoxes.forEach((value)=>{
        addOption(value,selectGearbox);
    });

}