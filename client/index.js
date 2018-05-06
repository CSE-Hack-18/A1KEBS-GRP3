console.log('index javascript working');

$(function(){
	// initialize modal
	$('.modal').modal();

	$('.room').on('click', (event) => {
		var room = event.target.children[0].textContent;
        var roomID = event.target.id;
        updatePatientModal(roomID);
		$('#modal-header').text("Room "+room);
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

function updateBedStatus(bed){
    $("#"+bed).html("check_box");
}