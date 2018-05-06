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

    client.on('getBeds', function (data, callback) {
        console.log("Getting the bed data.");
        mongo.getAllRooms(data, function (rooms) {
            var beds = [];
            for (var i = 0; i < rooms.length; i++) {
                beds = beds.concat(rooms[i].beds);
            }
            callback(beds);
        });

        client.on('getBedOwner', function (data, callback) {
            mongo.getPatientByBed(data, function (patient) {
                callback(patient);
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

        client.on('getAllRooms', function (unitName) {
            mongo.getAllRooms(unitName, function (rooms) {
                io.sockets.emit('rooms', rooms);
            });
        });

        client.on('findBedForPatient', function (personNumber) {
            console.log("Finding bed for " + personNumber);
            mongo.getPatientByID(personNumber, function (patient) {
                console.log("Patient:");
                console.log(patient);
                mongo.getAllRooms(patient.unit, function (rooms) {
                    console.log("Getting all rooms");
                    var roomFound = false;
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
                            roomFound = true;
                            break;
                        }
                    }
                    //No empty room found
                    //Find room with the least ammount of people and with people that leave
                    //the earliest
                    if (!roomFound) {

                        //find room with earliest leaving neighbour
                        //if(rooms[i] && rooms[i].beds[(j+1)%beds.length]){
                        async function findBestNeighbour(patientList) {
                            var earliest;
                            var chosenBed;
                            for (var i = 0; i < 8; i++) {
                                for (var j = 0; j < 2; j++) {

                                    // mongo.getPatientByID(rooms[i].beds[j].patient, function (patientObject) {
                                    //var patientObject = await getPatientByID(rooms[i].beds[j].patient, patientList);

                                    var patientObject = null;
                                    if (rooms[i].beds[j].patient != "") {
                                        console.log("Getting patient by id: " + rooms[i].beds[j].patient);
                                        for (var k = 0; k < patientList.length; k++) {
                                            if (patientList[k].personalNumber === rooms[i].beds[j].patient) {
                                                patientObject = patientList[k];
                                            }
                                        }
                                    }

                                    if (patientObject !== null && patientObject !== undefined) {

                                        if (earliest === null || earliest === undefined) {
                                            if (!rooms[i].beds[(j + 1) % 2].occupied) {
                                                earliest = patientObject;
                                                chosenBed = rooms[i].beds[(j + 1) % 2].number;
                                            }
                                        } else if (patientObject.dischargeDate < earliest.dischargeDate) {
                                            if (!rooms[i].beds[(j + 1) % 2].occupied) {
                                                earliest = patientObject;
                                                chosenBed = rooms[i].beds[(j + 1) % 2].number;
                                                console.log("chosenBed");
                                                console.log(chosenBed);
                                            }
                                        }
                                    }
                                    // });
                                }
                            }
                            return chosenBed;
                        }

                        function addPatientToBed(chosenBed, personNumber) {
                            if (chosenBed !== null || chosenBed !== undefined) {
                                mongo.addPatientToBed(chosenBed, personNumber);
                                console.log("Patient has been assigned bed "+chosenBed);
                                io.sockets.emit('assignedBed', chosenBed);
                            } else {
                                console.log("No bed available");
                            }
                        }

                        async function f1() {
                            patientList = await updatePatientList();
                            chosenBed = await findBestNeighbour(patientList);
                            addPatientToBed(chosenBed, personNumber);
                        }

                        f1();

                        // if(chosenBed === null || chosenBed === undefined){
                        //   console.log("No bed available");
                        //   console.log("chosenBed:");
                        //   console.log(chosenBed);
                        // }else {
                        //   mongo.addPatientToBed(chosenBed, personNumber);
                        //   io.sockets.emit('assignedBed', chosenBed);
                        // }
                    }
                });
            });
        });

        client.on('getPatientByBed', function (bedNumber) {
            console.log("Getting patient in bed " + bedNumber);
            mongo.getPatientByBed(patient, function (bed) {
                console.log(bed);
                io.sockets.emit('patient', patient);
            });
        });
    });
});


patientList = [];


function updatePatientList() {
    return new Promise(resolve => {
        mongo.getAllPatients(function (patients) {
            patientList = patients;
            console.log("updating patient list");
            resolve(patientList);
        });
        //  resolve(patientList);

        //        setTimeout(() => {
        //            Promise.resolve().then(function (value) {
        //                console.log("Resolved"); //// WHY DOES IT STOPPPPPPPPPPPPPP
        //            });
        //        }, 2000);


    });
}
