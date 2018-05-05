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
