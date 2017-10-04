//=======================================================
//GLOBALS
const
    URL_BASE = "olssonsfordonab/",
    searchBtn = document.getElementById("searchBtn"),
    selectBtn = document.getElementById("selectBtn"),
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

    //Get value of selections
    let vehicleType = selectVehicleType.selectedOptions[0].textContent;
    let vehicleModel = selectModel.selectedOptions[0].textContent;
    let vehicleGearbox = selectGearbox.selectedOptions[0].textContent;
    let vehicleBrand = selectBrand.selectedOptions[0].textContent;
    console.log(vehicleGearbox + " : " +vehicleModel+ " : " +vehicleBrand+ " : " +vehicleType);
    //check values
    let query = preventNullInQuery(["fordonstyp","brand","model","gearbox"],[vehicleType,vehicleBrand,vehicleModel, vehicleGearbox]);
    findByQuery("result",query,console.log);

    //TODO replace console.log with callback in findByQuery to handle results

}

function checkAvailabillityByDate(e){
    dateStartValue = dateStart.value;
    dateEndValue = dateEnd.value;

    //reset min and max
    if(e.target.name === "dateStart"){
        dateEnd.removeAttribute("min");
        dateEnd.min = dateStartValue;
    }else{
        dateEnd.removeAttribute("max");
        dateStart.max = dateEndValue;
    }

    //if only first date is selected
    if((dateEndValue === null || dateEndValue === "") &&
        (dateStartValue !== null)){
        //TODO show status message that an end date must be selected
        //prevent end from being smaller than start
        dateEnd.min = dateStartValue;
    }
    //if only last date is selected
    else if(dateEndValue !== null &&
        (dateStartValue === null || dateStartValue === null)){
        //TODO show status message that a start date must be seected
        dateStart.max = dateEndValue;
    }
    //if both dates are selected
    else if(dateEndValue !== null && dateStartValue !== null){
        searchBtn.removeAttribute("disabled");
        selectBtn.removeAttribute("disabled");
        findByQuery("date",`startDate=${dateStartValue}&endDate=${dateEndValue}`,findUniquePropertyValue);
    }

}

//fetch response by query
function findByQuery(router,query="",callback){

    fetch(`${router}/?${query}`)
        .then((response)=> {
            console.log(response);
            return response.json();
        })
        .then((result)=> {
            console.log(router + " query was sucessfull");
            callback(result);
        })
        .catch((err)=>{
            console.log(err);
        });

}

//prevent passed dates to be selected
function restrictPassedDate(){
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

//used to search array for unique values
function uniqesOnly(value, index, self){
    return self.indexOf(value) === index;
}

//add option element to select element
function addOption(value,parent){
    let option = document.createElement("option");
    option.textContent = value;
    parent.appendChild(option);
}

//find all unique property values for list of cars
function findUniquePropertyValue(result){
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

function preventNullInQuery(names,values){
    let query = "";
    values.forEach((val,i)=>{
        //console.log(val + " : " + (val !== "Gearbox"));
        if(
            (val !== null || val !== undefined) &&
            val !== "Gearbox" && val !== "VehicleType" &&
            val !== "Model" && val !=="Brand"
        ){
            if(i !== values.length-1){
                query+=names[i] + "=" + val + "&";
            }else{
                query+=names[i] + "=" + val;
            }
        }
    });
    console.log("string query: "+query);


    return query;
}