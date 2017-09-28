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

//Load view engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

//listen on 3000
app.listen(port);
console.log('server is alive at'+ port);
//=============================================================
//ROUTERS
let router = require("./public/routers/serverRouter");
app.use("/olssonsfordonab",router);

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
