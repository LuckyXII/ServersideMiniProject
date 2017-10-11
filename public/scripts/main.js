//=======================================================
//GLOBALS
const
    URL_BASE = "olssonsfordonab/",
    searchBtn = document.getElementById("searchBtn"),
    dateStart = document.getElementById("dateForm").children[1],
    dateEnd = document.getElementById("dateForm").children[3],
    login = document.getElementById("login"),
    selectVehicleType = document.getElementById("vehicleType"),
    selectBrand = document.getElementById("brand"),
    selectModel = document.getElementById("model"),
    carInfo = document.getElementById("carInfo"),
    selectGearbox = document.getElementById("gearbox"),
    vehicleContainer = document.getElementById("vehicleContainer");

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
login.addEventListener("click",loginOnClick);

//=======================================================
//FUNCTIONS

function rentCar(e){

    //TODO add values from car item
    let
        id = e.target.parent.attributes['data-Id'].value,
        logedIn = localStorage.getItem("logedIn"),
        rent = e.target.parent().children()[3], //TODO Add Correct Path
        totalRent = rent * calcRentalPeriod(dateStart.value, dateEnd.value),
        d = new Date();

    let rentInfo = {
          logedIn:logedIn,
          date: new Date(d.getFullYear(),d.getMonth()+1,d.getDate()),
          car: id,
          rentalPeriod: {
              start: dateStart.value,
              end: dateEnd.value
          },
          rentalCost:{ //TODO fix rentalcost
              day: rent,
              total: totalRent,
          }
    };

    let query = `logedIn=${rentInfo.logedIn}&date=${rentInfo.date}&car=${rentInfo.car}&rentalPeriod.start=${rentInfo.rentalPeriod.start}&rentalPeriod.end=${rentInfo.rentalPeriod.end}&rentalCost.day=${rentInfo.rentalCost.day}&rentalCost.total=${rentInfo.rentalCost.total}`;

    fetch(`/?${query}`,{method:"POST"})
    .then((response)=> {
    	return response.json();
    })
    .then((result)=> {
    	console.log(result);
    	
    });

}

function addClickListenerForCars() {
    //TODO add correct className and make sure data-id path is correct in rentCar
    let cars = document.getElementsByClassName("bookBtn");
    cars.forEach((car) => {
        car.addEventListener("click", rentCar);
    });
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
    vehicleContainer.innerHTML = "";
    console.log('available Cars: ' + JSON.stringify(result));

    carInfo.innerHTML = "";

    result.forEach((car) => {
        carInfo.style.border = "none";
        let carContainer = document.createElement('div');
        carContainer.setAttribute("class", "vehicleInfo");
        carContainer.setAttribute("data-id", car._id);
        console.log(car);

        let brandName = document.createElement('div'),
            carModel = document.createElement("div"),
            vehicleType = document.createElement("div"),
            bookBtn = document.createElement("button");
        brandName.textContent = car.brand;
        carModel.textContent = car.model;
        vehicleType.textContent = car.fordonstyp;
        bookBtn.textContent = "BOOK";
        bookBtn.className="bookBtn";

            
        // Checks if the searched vehicle has an image or gearbox
        let carImage = document.createElement("img");
        if(car.imgLink === undefined ) {
            console.log("no picture to this car");
            carImage.setAttribute("src", "https://bbcdn.io/bytbil-pro/news-large/b9/b90d585e-6786-4dd4-bfa7-ab00d4504964");
        } else {
            carImage.setAttribute("src", car.imgLink);
        }
        let gearBoxes = document.createElement("p");
        if(car.gearbox === undefined) {
            console.log("no gearbox for this search");
        } else {
            gearBoxes.textContent = car.gearbox;
            carContainer.appendChild(gearBoxes);
        }
        carContainer.appendChild(carImage);
            brandName = document.createElement('p');
            carModel = document.createElement("p");
            vehicleType = document.createElement("p");
            
            
        brandName.textContent = car.brand;
        carModel.textContent = car.model;
        vehicleType.textContent = car.fordonstyp;
        

        carContainer.appendChild(brandName);
        carContainer.appendChild(carModel);
        carContainer.appendChild(vehicleType);
        carContainer.appendChild(bookBtn);
        vehicleContainer.appendChild(carContainer);

    });


    //TODO AFTER all cars are added to result edit this to match classnames
    addClickListenerForCars();
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
        findByQuery("admin");
        window.location.href = 'http://localhost:3000/olssonsfordonab/admin';
    }else{
        //TODO add callback instead of console.log
        findByQuery("login",`personnr=${input}`,handleLogin);
    }

}

function handleLogin(result){
    console.log(result);
    let input = document.getElementById("loginInput");
    if(result.length === 0){
        
        if(/^\d{6,8}[-|(\s)]{0,1}\d{4}$/.test(input.value)){
            let name = prompt("Welcome new user we will create an account for you, please enter your name");
            console.log(name);
            findByQuery("login/createNewUser",`personnr=${input.value}&name=${name}`);
        }
        return 0;
    }
    //TODO LOGIN USER EVEN IF THEY*RE NEW
    input.hidden = true;
    login.textContent = result.name;
    login.style.width = "200px";
    login.style.right = "1px";
    localStorage.setItem("logedIn", JSON.stringify(result));
}

function calcRentalPeriod(start, finish){
    let diff = Date.parse(start) - Date.parse(finish);
    return diff / ( 1000 * 60 * 60 * 24 ); //millisec, min, hour, day

}