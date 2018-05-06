console.log('index javascript working');

var socket = io("http://localhost:8080");

socket.emit('findBedForPatient', "19820503-7554");
// socket.emit('findBedForPatient', "19671019-5774");
// socket.emit('findBedForPatient', "19810215-0797");
// socket.emit('findBedForPatient', "19740226-6329");
// socket.emit('findBedForPatient', "19920201-5993");
// socket.emit('findBedForPatient', "19950115-1527");
// socket.emit('findBedForPatient', "19751201-4857");
// socket.emit('findBedForPatient', "19870308-3459");
// socket.emit('findBedForPatient', "19900630-9788");
// socket.emit('findBedForPatient', "19830412-8664");
// socket.emit('findBedForPatient', "19581022-8534");
// socket.emit('findBedForPatient', "19180126-3852");
// socket.emit('findBedForPatient', "19221012-6293");



socket.on('assignedBed', function(data){
  console.log(data);
});
