var socket = io("http://localhost:8080");


var beds = [];


console.log("test");
socket.emit('getBeds', 'General Medicine', function(data){
   console.log(data); 
    beds = data;
    
    //populate beds
    for(bed in beds){
        if(bed.occupied){            
            occupyRoom(bed.bedNumber);
        }
    }
    
    
});


socket.on('updateRoom', (data) => {

});