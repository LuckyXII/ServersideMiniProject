cd %~dp0
mongoimport --db vehicleDatabase --jsonArray --collection members --file %~dp0fordon.json
pause