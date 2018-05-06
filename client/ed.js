var socket = io("http://localhost:8080");

$(function(){
	// initialize modal
	$('.modal').modal();

	socket.emit('getAllPatientsByUnit', 'ED', function (data) {
        console.log(data);
    });

	$('#person1').on('click', (event) => {
		event.preventDefault();
		socket.emit('findBedForPatient', '19920201-5993');
		console.log('person1');
		$('#person1').hide();
	})

	$('#person2').on('click', () => {
		event.preventDefault();
		socket.emit('findBedForPatient', '19950115-1527');
		console.log('person2');
		$('#person2').hide();
	})

	$('#person3').on('click', () => {
		event.preventDefault();
		socket.emit('findBedForPatient', '19671019-5774');
		console.log('person3');
		$('#person3').hide();
	})

})
