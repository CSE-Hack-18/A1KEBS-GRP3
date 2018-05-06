var socket = io("http://localhost:8080");

$(function(){
	// initialize modal
	$('.modal').modal();

	socket.emit('getAllPatientsByUnit', 'ED', function (data) {
        console.log(data);
    });

})

$('#button2').on('click', () => {
	$('#modal-room').modal('open');
})
