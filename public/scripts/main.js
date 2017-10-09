//=======================================================
//GLOBALS
const
    URL_BASE = "olssonsfordonab/",
    searchBtn = document.getElementById("searchBtn"),
    selectBtn = document.getElementById("selectBtn"),
    dateStart = document.getElementById("dateForm").children[0],
    dateEnd = document.getElementById("dateForm").children[1],
    login = document.getElementById("login"),
    selectVehicleType = document.getElementById("vehicleType"),
    selectBrand = document.getElementById("brand"),
    selectModel = document.getElementById("model"),
    carInfo = document.getElementById("carInfo"),
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
//selectBtn.addEventListener("click", checkAvailabillityByQuery);
dateStart.addEventListener("change",checkAvailabillityByDate);
dateEnd.addEventListener("change",checkAvailabillityByDate);
login.addEventListener("click",loginOnClick);
//=======================================================
//FUNCTIONS

function rentCar(){
    //TODO add values from car item
    let car = {
        "fordonstyp" : "personbil",
        "requiredDrivingLicense" : "B",
        "brand" : "Peugeot",
        "gearbox" : "manuell",
        "model" : "308",
        "year" : 2007,
        "fuel": "diesel",
        "dagshyra" : 298,
        "imgLink" : "https://upload.wikimedia.org/wikipedia/commons/4/40/Peugeot_308_5-T%C3%BCrer_front.JPG",
        "isAvailable":true,
        "kommentarer": "none"
    };

    for(let prop in car){

    }
}



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
    findByQuery("result",query,addCarsToResult);

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

    fetch(`${URL_BASE}${router}/?${query}`)
        .then((response)=> {
           // console.log(response);
            return response.json();
        })
        .then((result)=> {
            console.log(router + " query was sucessfull");
            console.log(result);
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

    addCarsToResult(result);

}
// show ALL cars available after search
function addCarsToResult(result) {
    
    console.log('available Cars: ' + JSON.stringify(result));
    // Todo add cars to list, attach car _Id as data-id
    /*HOW TO USE DATA-insertIdentifier TAGS TO STORE _Id EXAMPLE WOOP
    * <div data-Id="car._Id" class="row">STUFF</div>
    *
    * Can later be retrieved as:
    *  if div.row is the parent of the button
     * "e.target.parent.attributes['data-Id'].value;"
    * */
    
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


function loginOnClick(){
    let input = document.getElementById("loginInput").value;

    if(input === "ADMIN"){
        //TODO if input is ADMIN render admin page and do NOT run findByQuery
        console.log("is admin");
    }else{
        //TODO add callback instead of console.log
        findByQuery("login",`personnr=${input}`,handleLogin);
    }

}

function handleLogin(result){
    let input = document.getElementById("loginInput");
    if(result.length === 0){
        if(/^\d{6,8}[-|(\s)]{0,1}\d{4}$/.test(input.value)){
            let name = prompt("Welcome new user we will create an account for you, please enter your name");
            findByQuery("login/createNewUser",`personnr=${input.value}&name=${name}`);
        }
        return 0;
    }

    input.hidden = true;
    login.textContent = result.name;
    login.style.width = "200px";
    login.style.right = "1px";
    localStorage.setItem("logedIn", JSON.stringify(result));
}