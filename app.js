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

	client.on('getUnit', (args) => {
		console.log(argsa);
	})

    client.on('getBeds', function (data, callback) {
        console.log("Getting the bed data.");
        mongo.getAllRooms(data, function(rooms){       
            var beds = [];
            //console.log(rooms);
            for(var i=0; i<rooms.length; i++){
                beds = beds.concat(rooms[i].beds);
            }
            console.log(beds);
            callback(beds);
        });        
    });

    client.on('getPatientByID', function (personNumber) {
        mongo.getPatientByID(personNumber, function (patient) {
          console.log("Getting patient");
          console.log(patient);
          console.log("Sending patient");

          io.sockets.emit('patient', patient);
      });
    });

    client.on('getAllRooms', function(rooms){
      console.log(rooms);
    });


    client.on('findBedForPatient', function (personNumber) {
        console.log("Finding bed");
        mongo.getPatientByID(personNumber, function (patient) {
          console.log("Patient:");
          mongo.getAllRooms(patient.unit, function (rooms) {
            console.log(rooms[0]);
            console.log("Getting all rooms");
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
            var now = Date.now();
            var earliest;
            var chosenBed;
            //find room with earliest leaving neighbour
            for(var i=0; i < rooms.length; i++){
              for(var j=0; j < rooms[i].beds.length; j++){

                mongo.getPatientByID(rooms[i].beds[j].patient, function (patient) {

                  if(earliest === null){
                    for(var k = 0; k < rooms[i].beds.length; k++){
                      if(!rooms[i].beds[k].occupied){
                        earliest = patient;
                        chosenBed = rooms[i].beds[k].number;
                      }
                    }
                  }

                  if(patient.dischargeDate - now < earliest.dischargeDate - now){
                    for(var k = 0; k < rooms[i].beds.length; k++){
                      if(!rooms[i].beds[k].occupied){
                        earliest = patient;
                        chosenBed = rooms[i].beds[k].number;
                      }
                    }
                  }
                });
              }
            }
            if(earliest == null){
              console.log("No bed available");
            }else {
              mongo.addPatientToBed(rooms[i].beds[0].number, personNumber);
              io.sockets.emit('assignedBed', rooms[i].beds[0].number);
            }

          });
        });
    });

    client.on('getPatientByBed', function (bedNumber) {
        console.log("Getting patient");
        mongo.getPatientByBed(patient, function (bed) {
            console.log(bed);
            io.sockets.emit('patient', patient);
        });
    });
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
