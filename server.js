//================================================================
// server settings
const
    express = require("express"),
    app = express(),
    port = 3000,
    mongoose = require("mongoose"),
    path = require("path");

mongoose.promise = global.Promise;
mongoose.connect("mongodb://localhost/vehicleDatabase", {
    useMongoClient: true
});

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Pug view
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

//listen on 3000
app.listen(port);
//=============================================================
//ROUTERS
let router = require("./public/routers/serverRouter");
app.use("/",router);
//=============================================================
//DATABASE


//listen for connection to db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //place db code in here

});

//=============================================================
//QUERYS
