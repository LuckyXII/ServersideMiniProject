cd %~dp0
mongoimport --db vehicleDatabase --jsonArray --collection vehicles --file %~dp0fordon.json
pause