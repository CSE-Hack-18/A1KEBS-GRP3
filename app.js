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

    client.on('register', function (data) {
        console.log("A new user has registered.");
        console.log(data);
        //mongo.saveUser(data);
    });

    client.on('getPatientByID', function (personNumber) {
        var patient = getPatientByID(personNumber);
        console.log("Getting patient");
        console.log(patient);
        console.log("Sending patient");

        io.sockets.emit('patient', patient);
    });


    client.on('findBedForPatient', function (personNumber) {
        console.log("Finding bed");
        var patient = getPatientByID(personNumber);
        mongo.getAllRooms(patient.unit, function (rooms) {
            //Look for room with empty beds
            for (var i = 0; i < rooms.length; i++) {
                var freeBeds = 0;
                for (var j = 0; j < rooms[i].beds.length; j++) {
                    if (!rooms[i].beds[j].occupied) {
                        freeBeds++
                    }
                }
                //If the room is empty
                if (freeBeds == rooms[i].beds.length) {
                    mongo.addPatientToBed(rooms[i].beds[0].number, personNumber);
                    io.sockets.emit('assignedBed', rooms[i].beds[0].number);
                    break;
                }
            }
            //No room with an empty bed found
            //Find room with the least ammount of people and with people that leave
            //the earliest


        });
    });

    client.on('getPatientByBed', function (bedNumber) {
        console.log("Getting patient");
        mongo.getPatientByBed(personNumber, function (bed) {
            console.log(bed);
            patient = getPatientByID(personNumber);
            io.sockets.emit('patient', patient);
        });
    });


});


function getPatientByID(personNumber) {
    mongo.getPatientByID(personNumber, function (patient) {
        return patient;
    });
}

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
// mongo.getPatientByID("12234567", function (data) {
//     console.log(data.name);
// });
//
// console.log("ADD TO BED");
// mongo.addPatientToBed("A2", "12234567");
//
// mongo.getPatientByBed("A2", function (data) {
//     console.log(data)
// });
