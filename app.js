var express = require('express')
var path = require('path')
var io = require('socket.io')(8080);

//var mongo = require('./server/mongo.js')

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

    client.on('getPatientByID', function(personNumber) {
      var patient = getPatientByID(personNumber);
      console.log("Getting patient");
      console.log(patient);
      console.log("Sending patient");

      io.sockets.emit('patient',patient);
      });
    });

    client.on('findBedForPatient', funtion(personNumber){
      console.log("Finding bed");
      var patient = getPatientByID(personNumber);
        mongo.getAllRooms(patient.unit, function(rooms){
          //Look for room with empty beds
          for(var i = 0; i < rooms.length; i++){
            var freeBeds = 0;
            for(var j = 0; j < rooms[i].beds.length; j++){
              if(!rooms[i].beds[j].occupied){
                freeBeds++
              }
            }
            //If the room is empty
            if(freeBeds == rooms[i].beds.length){
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

              patient = getPatientByID(rooms[i].beds[j].patient);
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
            }
            if(earliest == null){
              console.log("No bed available");
            }
          }



        });
    });

    client.on('getPatientByBed', function( (bedNumber) {
      console.log("Getting patient");
      mongo.getPatientByBed(personNumber, function(bed){
        console.log(bed);
        patient = getPatientByID(personNumber);
        io.sockets.emit('patient',patient);
      });
    });

});

function getPatientByID(personNumber){
  mongo.getPatientByID(personNumber, function(patient) {
    return patient;
  }
}
