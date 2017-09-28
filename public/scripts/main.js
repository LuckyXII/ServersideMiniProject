//=======================================================
//GLOBALS
const
    searchBtn = document.getElementById("searchBtn"),
    dateStart = document.getElementById("dateForm").children[0],
    dateEnd = document.getElementById("dateForm").children[1];
//=======================================================
//CLASSES


//=======================================================
//MAIN

//=======================================================
//LISTENERS
searchBtn.addEventListener("click",checkAvailabillityByQuery);
/*dateStart.addEventListener("change",checkAvailabillityByDate);
dateStart.addEventListener("change",checkAvailabillityByDate);*/
//=======================================================
//FUNCTIONS

function checkAvailabillityByQuery(e){
    e.preventDefault();
    const dateStartValue = dateStart.valueAsDate;
    const dateEndValue = dateEnd.valueAsDate;

    //TODO add rest of input data, make query and filter cars

}

function checkAvailabillityByDate(e){
    const dateStartValue = dateStart.valueAsDate;
    const dateEndValue = dateEnd.valueAsDate;

    if(dateEndValue === null && dateStartValue !== null){
        findByQuery(`startDate=${dateStartValue}`);
    }
    else if(dateEndValue !== null && dateStartValue === null){
        findByQuery(`endDate=${dateEndValue}`);
    }
    else if(dateEndValue !== null && dateStartValue !== null){
        findByQuery(`startDate=${dateStartValue}&endDate=${dateEndValue}`);
    }

}


function findByQuery(query=""){
    fetch(`olssonsfordonab/date?${query}`)
    .then((response)=> {
    	return response.json();
    })
    .then((result)=> {
    	console.log(result);
    	//TODO show results in view
    })
    .catch((err)=>{
        console.log(err);
    });

}
