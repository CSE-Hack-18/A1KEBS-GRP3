var socket = io("http://localhost:8080");


var beds = [];

socket.emit('getBeds', 'General Medicine', function (data) {
    beds = data;
    for (var i = 0; i < beds.length; i++) {
        console.log(beds[i]);
        getPersonForBed(i, function (i, e) {
            beds[i].patient = e;
            if(beds[i].occupied){
                fillBed(beds[i].number);
            }
        });
    }
});

function getPersonForBed(i, callback) {
    socket.emit('getBedOwner', beds[i].number, function (data) {
        callback(i, data);
    });
}


socket.on('updateRoom', (data) => {
    //fillRoom(bed.number);
});
