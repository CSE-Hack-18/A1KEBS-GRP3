console.log('index javascript working');

var socket = io("http://localhost:8080");


//on load
() => {
	socket.emit('getUnit', 'generalMedicine', (data) => {
		console.log(data);
	});
}

socket.on('updateRoom', (data) => {
	
});
