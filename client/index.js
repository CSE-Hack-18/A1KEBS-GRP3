console.log('index javascript working');

var socket = io("http://localhost:8080");

socket.emit('getAllRooms');

socket.on('assignedBed', function(data){
  console.log(data);
});
