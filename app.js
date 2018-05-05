var express = require('express')
var path = require('path')
var io = require('socket.io')(8080);

var mongo = require('./server/mongo.js')

var app = express()

app.use(express.static('client'));



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/home.html'))
})

app.get('/client', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/client.html'))
})

app.listen(3000, function () {
    console.log("Server started on port 3000.")
})

io.on('connection', function (client) {
    console.log("A new client has connected...");

    // client.on('getPatient', function(patientPersonNumber) {
    //   console.log("Getting patient");
    //   mongo.getPatient(patientPersonNumber, function(patient))
    //
    // })




});

var unit = {
    name: "Intensive care",
    nurses: [{
        name: "Nurse AB",
        experience: "experienced"
    }],
    doctor: [{
        name: "Doctor B"
    }]
};

var rooms = [{
    unit: "Intensive care", 
        name: "Room A",
        type: "Sleeping",
        beds: [
            {
                number: "A1",
                occupied: false,
                patient: ""
          },
            {
                number: "A2",
                occupied: false,
                patient: ""
          }
        ],
        facilities: ["something", "something", "something"]
    }];

var pat = {
    name: "Patient A",
    personalNumber: "12234567",
    dateOfBirth: new Date(),
    admissionDate: new Date(),
    dischargeDate: new Date(),
    unit: "Hospital"
};

console.log("test");
//mongo.addPatient(pat);
console.log("Get ALL PATIENTS");
//mongo.getAllPatients(function(data){
//    console.log(data);
//})
mongo.getPatientByID("12234567", function (data) {
    console.log(data.name);
});

console.log("ADD TO BED");
mongo.addPatientToBed("A2", "12234567");

mongo.getPatientByBed("A2", function(data){
    console.log(data)
});