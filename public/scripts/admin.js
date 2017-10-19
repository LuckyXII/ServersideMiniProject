//=======================================================
//GLOBALS
const addB = document.getElementById("addB"),
      login = document.getElementById("login"),
      deleteBtn = document.getElementById("deleteB"),
      updateBtn = document.getElementById("updateB"),
      carRows = document.getElementsByClassName('row'),
	  URL_BASE = "olssonsfordonab/update";

//=======================================================
//LISTENERS


  

addClickListenerCarRow();
loginAndLogoutAdmin();

login.addEventListener("click", loginAndLogoutAdmin);
deleteBtn.addEventListener("click",deleteCar);
updateBtn.addEventListener("click", updateCar);

//=======================================================
//FUNCTIONS

//add listeners to all car rows
function addClickListenerCarRow(){
    for(let i = 0; i<carRows.length;i++){
        carRows[i].addEventListener('click',fillEditForm);
       
    }
}

// login AND out ADMIN
function loginAndLogoutAdmin(){
    let input = document.getElementById("loginInput");
    if(login.getAttribute("data-logedin")){
        logout();
        return;
    }

    input.hidden = true;
    login.textContent = "Logout: ADMIN";
    login.style.width = "200px";
    login.style.right = "1px";
    login.setAttribute("data-logedin",true);

}

//logs ADMIN out and sends him to index
function logout(){
    console.log("LOGOUT!");
    let input = document.getElementById("loginInput");
    input.hidden = false;
    login.textContent = "Login/Signup";
    login.removeAttribute("style");
    login.setAttribute("data-logedin",false);
    localStorage.removeItem("logedIn");
    window.location.href = 'http://localhost:3000/olssonsfordonab/';
}

//fills edit form with values from selected car
function fillEditForm(e){
    let tableData = e.target.parentNode;
    let _id = tableData.attributes["data-id"].value;
    let image = tableData.children[0].children[0].src;
    let fordonstyp = tableData.children[1].textContent;
    let brand = tableData.children[2].textContent;
    let model = tableData.children[3].textContent;
    let year = tableData.children[4].textContent;
    let fuel = tableData.children[5].textContent;
    let gearbox = tableData.children[6].textContent;
    let reqLicense = tableData.children[7].textContent;
    let dagsHyra = tableData.children[8].textContent;
    let isAvailable = tableData.children[9].textContent;
    let skador = tableData.children[10].textContent;
    
    console.log("tabledataChild!"+tableData.children[1].textContent)
    var formData = document.getElementById('adminForm');

    let idHolder = document.getElementById("idHolder");
    idHolder.textContent = _id;
    let vehicleTypeInput = formData.children[1];
    vehicleTypeInput.value = fordonstyp;
    let brandInput = formData.children[2].children[1];
    brandInput.value = brand;
    let modelInput = formData.children[3].children[1];
    modelInput.value = model;
    let yearInput = formData.children[4].children[1];
    yearInput.value = year;
    let fuelSelect = formData.children[5].children[1];

    for(let i=0; i<fuelSelect.children.length; i++ ){
        console.log(fuelSelect.children[i].textContent +  " : " + fuel);
        if(fuelSelect.children[i].textContent === fuel){
            fuelSelect.children[i].selected = true;
            console.log("TRUE");
        }
    }
    
    let gearboxSelect = formData.children[6].children[1];
    for(let i=0; i<gearboxSelect.children.length; i++ ){
        if(gearboxSelect.children[i].textContent === gearbox){
            gearboxSelect.children[i].selected = true;
        }
    }

    let licenceSelect = formData.children[7].children[1];
    for(let i=0; i<licenceSelect.children.length; i++ ){
        if(licenceSelect.children[i].textContent === reqLicense){
            licenceSelect.children[i].selected = true;
        }
    }

    let priceInput = formData.children[8].children[1];
    priceInput.value = dagsHyra;

    let isAvailableSelect = formData.children[9].children[1];
    for(let i=0; i<isAvailableSelect.children.length; i++ ){
        if(isAvailableSelect.children[i].textContent === isAvailable){
            isAvailableSelect.children[i].selected = true;
        }
    }

    let commentInputValue = formData.children[10].children[1];
    commentInputValue.textContent = skador;
    
}



// update car from database
function updateCar(e) {
    e.preventDefault();

    let tableData = e.target.parentNode;
    /*let image = tableData.children[0].children[0].src;*/
    let fordonstyp = document.getElementById('vehicleTypeInput').value,
     brand = document.getElementById('brandInput').value,
     model = document.getElementById('modelInput').value,
     year = document.getElementById('date').value,
     fuel = document.getElementById('fuel').selectedOptions[0].value,
     gearbox = document.getElementById('gearboxFormSelect').value,
     reqLicense = document.getElementById('licence').value,
     dagsHyra = document.getElementById('price').value,
     isAvailable = document.getElementById('isAvailable').value,
     //skador = document.getElementById('comment').value,
     id = document.getElementById("idHolder").textContent;
	console.log("Table brand: "+brand);
    
    let query =`id=${id}&brand=${brand}&fordonstyp=${fordonstyp}&model=${model}&year=${year}&fuel=${fuel}&gearbox=${gearbox}&reqLicense=${reqLicense}&dagsHyra=${dagsHyra}&isAvailable=${isAvailable}`;
    findByQuery("admin/update",query);

    
}

//delete car
function deleteCar(e){
	e.preventDefault();
    let id = document.getElementById("idHolder").textContent;
    findByQuery("admin/delete",`id=${id}`);
	window.location.href='/olssonsfordonab/admin';
}


function findByQuery(router,query="",callback){
    fetch(`${router}/?${query}`)
        .then((response)=> {
            console.log(response);
            return response.json();
        })
        .then((result)=> {
            console.log(router + " query was sucessfull");
            console.log(result);
            if(arguments[2] !== undefined) {
               callback(result); 
            }
        })
        .catch((err)=>{
            console.log(err);
        });
}