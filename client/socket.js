var socket = io("http://localhost:8080");

var beds = [];

socket.emit('getBeds', 'General Medicine', function (data) {
    beds = data;
    for (var i = 0; i < beds.length; i++) {
        getPersonForBed(i);
    }
});

function getPersonForBed(i) {
    socket.emit('getBedOwner', beds[i].number, function (data) {
        beds[i].patient = data;
            if(beds[i].occupied){
                addPatientToBed(beds[i].number);
            }
    });
}

socket.on('updateRoom', (data) => {
    var location = getBedLocation(data);
    getPersonForBed(location);
});

function getBedLocation(bedNumber){
    var bed = $.grep(beds, function(index){
        return index.number === bedNumber})[0];
    var index = beds.indexOf(bed);
    return index;
}
