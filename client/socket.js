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
        if (beds[i].occupied) {
            addPatientToBed(beds[i].number);
        }
    });
}

socket.on('updateRoom', (data) => {
    var location = getBedLocation(data);
    getPersonForBed(location);
});

function getBedLocation(bedNumber) {
    var bed = $.grep(beds, function (index) {
        return index.number === bedNumber
    })[0];
    var index = beds.indexOf(bed);
    return index;
}

function updatePatientModal(roomNumber) {
    var bed1 = roomNumber + "1";
    var bed2 = roomNumber + "2";
    var patient1 = beds[getBedLocation(bed1)].patient;
    var patient2 = beds[getBedLocation(bed2)].patient;
    //clear all of the fields first
    clearModal();
    
    if (patient1 != null) {
        $("#patient-1-name").text(patient1.name);
        $("#patient-1-pn").text(patient1.personalNumber);
        $("#patient-1-dob").text(patient1.dateOfBirth);
        $("#patient-1-adate").text(patient1.admissionDate);
        $("#patient-1-ddate").text(patient1.dischargeDate);
        $("#patient-1-unit").text(patient1.unit);
        $("#patient-1-condition").text(patient1.condition);
    }
    if (patient2 != null) {
        $("#patient-2-name").text(patient2.name);
        $("#patient-2-pn").text(patient2.personalNumber);
        $("#patient-2-dob").text(patient2.dateOfBirth);
        $("#patient-2-adate").text(patient2.admissionDate);
        $("#patient-2-ddate").text(patient2.dischargeDate);
        $("#patient-2-unit").text(patient2.unit);
        $("#patient-2-condition").text(patient2.condition);
    }
}

function clearModal() {
    $("#patient-1-name").text("");
    $("#patient-1-pn").text("");
    $("#patient-1-dob").text("");
    $("#patient-1-adate").text("");
    $("#patient-1-ddate").text("");
    $("#patient-1-unit").text("");
    $("#patient-1-condition").text("");

    $("#patient-2-name").text("");
    $("#patient-2-pn").text("");
    $("#patient-2-dob").text("");
    $("#patient-2-adate").text("");
    $("#patient-2-ddate").text("");
    $("#patient-2-unit").text("");
    $("#patient-2-condition").text("");
}
