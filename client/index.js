console.log('index javascript working');

$(function(){
	// initialize modal
	$('.modal').modal();

// socket.emit('findBedForPatient', "19820503-7554");
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


	$('#button1').on('click', () => {

	})

	$('#button2').on('click', () => {
		$('#modal-room').modal('open');
	})

	$('.room').on('click', (event) => {
		var room = event.target.children[0].textContent;
        var roomID = event.target.id;
        updatePatientModal(roomID);
		$('#modal-header').text(room);
		$('#modal-room').modal('open');
	})

	$('.treatment-room').on('click', (event) => {
		$('#modal-treatment-room').modal('open');
	})

	$('.staff-room').on('click', (event) => {
		$('#modal-staff-room').modal('open');
	})
});

// add OR remove
function addToRoom(room) {

}

function addPatientToBed(bed){
    $("#"+bed).html("check_box");
}