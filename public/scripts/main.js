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
    cancelCar = document.getElementById("cancelCar"),
    vehicleContainer = document.getElementById("searchResults");
    
    

var dateStartValue, dateEndValue, isLogedin = false;
//=======================================================
//CLASSES

//=======================================================
//MAIN
checkIfLogedin();
restrictPassedDate();
//=======================================================
//LISTENERS
searchBtn.addEventListener("click",checkAvailabillityByQuery);
dateStart.addEventListener("change",checkAvailabillityByDate);
dateEnd.addEventListener("change",checkAvailabillityByDate);
login.addEventListener("click",loginOnClick);
cancelCar.addEventListener("click", cancelBooking);
//=======================================================
//FUNCTIONS

//rent car
function rentCar(e){
    e.preventDefault();
    //can only rent if loged in

    if(localStorage.getItem("logedIn") === (undefined || null) ){
        return;
    }
	
    let
        id = e.target.attributes['data-id'],
        logedIn = JSON.parse(localStorage.getItem("logedIn")),
        rent = e.target.parentNode.children[8].textContent,
        totalRent = rent * calcRentalPeriod(dateStart.value, dateEnd.value),
        d = new Date();

		console.log(logedIn)

    let rentInfo = {
          logedIn:logedIn.personnr,
          date: new Date(d.getFullYear(),d.getMonth()+1,d.getDate()),
          car: id,
          rentalPeriod: {
              start: dateStart.value,
              end: dateEnd.value
          },
          rentalCost:{
              day: rent,
              total: totalRent,
          }
    };
	console.log(rentInfo)
    //update logedin with rented car
    logedIn.bookedCar = rentInfo.car;
    localStorage.setItem("logedIn",JSON.stringify(logedIn));

    //query
    let query = `${URL_BASE}?logedIn=${rentInfo.logedIn}&date=${rentInfo.date}&car=${rentInfo.car}&rentalPeriodStart=${rentInfo.rentalPeriod.start}&rentalPeriodEnd=${rentInfo.rentalPeriod.end}&rentalCostDay=${rentInfo.rentalCost.day}&rentalCostTotal=${rentInfo.rentalCost.total}`;

    let init = {
      method:'POST'
    };

    fetch(`/${query}`,init)
    .then((response)=> {
    	return response.json();
    })
    .then((result)=> {
        //show cancel booking button
        console.log(result);
        console.log("VISIBLE" + rentInfo.rentalPeriod.start);
        cancelCar.style.visibility = "visible";
    	
    });

}

//add clicklistener to all cars
function addClickListenerForCars() {
    //TODO add correct className and make sure data-id path is correct in rentCar
    let cars = document.getElementsByClassName("bookBtn");
    for(let i = 0; i < cars.length; i++){
        cars[i].addEventListener("click", rentCar);
    }

}


//find available cars by query
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

}

//sort by date
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
    
    //console.log('available Cars: ' + JSON.stringify(result));
    carInfo.style.display = "none";

    let carTable = document.getElementById("t01");

    //create car row
    result.forEach((car) => {
        
        let tr = createElm("tr");
        tr.className = "row";

        let imgTd = createElm("td");
        let img = createElm("img");
        img.src=result.imgLink;
        img.alt ="Image";
        imgTd.appendChild(img);
        tr.appendChild(imgTd);

        let type = createElm("td");
        type.className="fordonstyp";
        type.textContent = car.fordonstyp;
        tr.appendChild(type);

        let brand = createElm("td");
        brand.className="brand";
        brand.textContent = car.brand;
        tr.appendChild(brand);

        let model = createElm("td");
        model.className="brand";
        model.textContent = car.model;
        tr.appendChild(model);

        let year = createElm("td");
        year.className="year";
        year.textContent = car.year;
        tr.appendChild(year);

        let fuel = createElm("td");
        fuel.className="fuel";
        fuel.textContent = car.fuel;
        tr.appendChild(fuel);

        let gearbox = createElm("td");
        gearbox.className="gearbox";
        gearbox.textContent = car.gearbox;
        tr.appendChild(gearbox);

        let requiredDrivingLicense = createElm("td");
        requiredDrivingLicense.className="reqLicense";
        requiredDrivingLicense.textContent = car.requiredDrivingLicense;
        tr.appendChild(requiredDrivingLicense);

        let dagshyra = createElm("td");
        dagshyra.className="dagshyra";
        dagshyra.textContent = car.dagshyra;
        tr.appendChild(dagshyra);

        let bookBtn = createElm("button");
        bookBtn.textContent = "BOOK";
        bookBtn.className = "bookBtn";
        bookBtn.attributes["data-id"]=car._id;
        tr.appendChild(bookBtn);

        let kommentarer = createElm("td");
        kommentarer.className="comments";
        try{
            kommentarer.textContent = car.kommentarer.skador;
        }catch(e){/*IGNORE*/}
        tr.appendChild(kommentarer);

        carTable.appendChild(tr);

    });
    //add cars to result
    vehicleContainer.appendChild(carTable);

    //when all cars are added add listeners
    addClickListenerForCars();

}

//prevents not allowed values in query
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

//login
function loginOnClick(){
    if(isLogedin){

        logout();
        return;
    }

    let input = document.getElementById("loginInput").value;

    //check if ADMIN or user
    if(input === "ADMIN"){
        console.log("is admin");
        findByQuery("admin");
        window.location.href = 'http://localhost:3000/olssonsfordonab/admin';
    }else{
        findByQuery("login",`personnr=${input}`,handleLogin);
    }

}

//log in existing user or create new
function handleLogin(result){
    let input = document.getElementById("loginInput");
    if(result.length === 0){
        
        if(/^\d{6,8}[-|(\s)]{0,1}\d{4}$/.test(input.value)){
            let name = prompt("Welcome new user we will create an account for you, please enter your name");
            console.log(name);
			console.log(input.value)
            findByQuery("login/createNewUser",`personnr=${input.value}&name=${name}`,userIsSaved);
			console.log("Efter FindByQ på 381")
        }
        return 0;
    }

    //if logedin user has rented a car show cancel cars button
    let rentedCar = result.rented;
    if(rentedCar !== null && rentedCar !== undefined){
        console.log(rentedCar);
        cancelCar.style.visibility = "visible";
    }

    input.hidden = true;
    login.textContent = "Logout: " + result.name;
    login.style.width = "200px";
    login.style.right = "1px";
    isLogedin = true;
    localStorage.setItem("logedIn", JSON.stringify(result));
}

//if user was sucessfully saved
function userIsSaved(result){
	console.log("userIsSaved at 402")
	console.log(result)
    let input = document.getElementById("loginInput");
    if(result.saved){
        input.hidden = true;
        login.textContent = "Logout: " + result.name;
        login.style.width = "200px";
        login.style.right = "1px";
        isLogedin = true;
        localStorage.setItem("logedIn", JSON.stringify(result));
    }
}

//logout
function logout(){

    let input = document.getElementById("loginInput");
    input.hidden = false;
    login.textContent = "Login/Signup";
    login.removeAttribute("style");
    isLogedin = false;
    console.log(login.attributes["data-logedin"]);
    localStorage.removeItem("logedIn");
    cancelCar.style.visibility = "hidden";
}

//  cancel booking function
function cancelBooking() {
    let logedIn = JSON.parse(localStorage.getItem("logedIn"));
    findByQuery("update/cancelBooking",`carId=${logedIn.bookedCar}&personnr=${logedIn.personnr}`);
    logedIn.rented = null;
    localStorage.setItem("logedIn", JSON.stringify(logedIn));
    alert("your car booking is now canceled");
    cancelCar.style.visibility = "hidden";
}

//cancel booked car
function calcRentalPeriod(start, finish){
    let diff = (Date.parse(start) - Date.parse(finish));
    diff = diff > 0 ? diff : diff*-1;
    return diff / ( 1000 * 60 * 60 * 24 ); //millisec, min, hour, day

}

//check if a user is already signed in
function checkIfLogedin(){
    let logedIn = localStorage.getItem("logedIn");
    if(logedIn !== undefined && logedIn !== null ){
        let input = document.getElementById("loginInput");
        input.value = JSON.parse(localStorage.getItem("logedIn")).personnr;
        loginOnClick();
    }
}

//create new element
function createElm(elm){
    return document.createElement(""+elm);
}

