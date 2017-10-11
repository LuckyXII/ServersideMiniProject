//=======================================================
//GLOBALS
const
    searchB = document.getElementById("searchB"),
    selectFuel = document.getElementById("fuel"),
    selectLicence = document.getElementById("licence"),
    selectStatus = document.getElementById("isAvailable"),
    selectComment = document.getElementById("comment"),
    selectGearbox = document.getElementById("gearbox"),
    selectBrand = document.getElementById("brand"),
    selectModel = document.getElementById("model"),
    selectVehicleType = document.getElementById("vehicleType"),
    selectDate = document.getElementById("date"),
    selectPrice = document.getElementById("price")
    addB = document.getElementById("addB"),
    deleteB = document.getElementById("deleteB"),
    updateB = document.getElementById("updateB");

//=======================================================
//LISTENERS
// searchB.addEventListener('click',checkSearch);
// addB.addEventListener('click',);
// deleteB.addEventListener('click',);
// updateB.addEventListener('click',);
  
const carRows = document.getElementsByClassName('row');
addClickListenerCarRow();


//=======================================================
//FUNCTIONS

function addClickListenerCarRow(){

    for(let i = 0; i<carRows.length;i++){
        carRows[i].addEventListener('click',fillEditForm);
       
    }
}



function fillEditForm(e){
    let tableData = e.target.parentNode;

    console.log(tableData.attributes)
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

    var formData = document.getElementById('adminForm');

    let idHolder = document.getElementById("idHolder");
    idHolder.textContent = _id;
    let vehicleTypeInput = formData.children[1].children[1];
    vehicleTypeInput.value = fordonstyp;
    let brandInput = formData.children[2].children[1];
    brandInput.value = brand;
    let modelInput = formData.children[3].children[1];
    modelInput.value = model;
    let yearInput = formData.children[4].children[1];
    yearInput.value = year;
    let fuelSelect = formData.children[5].children[1];
    for(let i=0; i<fuelSelect.children.length; i++ ){
        if(fuelSelect.children[i].textContent === fuel){
            fuelSelect.children[i].selected = true;
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