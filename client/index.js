console.log('index javascript working');

$(function(){
	// initialize modal
	$('.modal').modal();

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
    
    $("#btn-add-person").click(function(){
       var number = $("#input-personal-number").val();
        addPersonToBed(number);
    });
});

// add OR remove
function addToRoom(room) {

}

function updateBedStatus(bed){
    $("#"+bed).html("check_box");
}