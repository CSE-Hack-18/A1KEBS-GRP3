var socket = io("http://localhost:8080");

var beds = [];
$(document).ready(function () {
    socket.emit('getBeds', 'General Medicine', function (data) {
        beds = data;
        for (var i = 0; i < beds.length; i++) {
            getPersonForBed(i);
        }
    });

    socket.on('assignedBed', (data) => {
        var textString = "A new patient has been assigned to bed "+data+"!";
        //var toastHtml = '<span>'+textString+'</span><button class="btn-flat toast-action id="view-added">View</button>';
        var toastHtml = '<span>'+textString+'</span>';
        if(data === null){
            textString = "No bed found for patient."
            toastHtml = '<span>'+textString+'</span>';
        }
        console.log(textString);
        M.toast({html: toastHtml});
//        $(document).one('click', '#view-added', function(){
//            var room = data.substr(0, 2);
//            console.log(room);
//            $("#"+room).click();
//        });
        var location = getBedLocation(data);
        beds[location].occupied = true;
        getPersonForBed(location);

    });
});

// find who is staying in the specified bed
function getPersonForBed(i) {
    socket.emit('getBedOwner', beds[i].number, function (data) {
        beds[i].patient = data;
        if (beds[i].occupied) {
            updateBedStatus(beds[i].number);
        }
    });
}

// have the server figure out where to put the person
function addPersonToBed(personalNumber){
   socket.emit('findBedForPatient', personalNumber);
}

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
        $("#patient-1-dob").text(moment(patient1.dateOfBirth).format('YYYY-MM-DD'));
        $("#patient-1-adate").text(moment(patient1.admissionDate).format('YYYY-MM-DD'));
        $("#patient-1-ddate").text(moment(patient1.dischargeDate).format('YYYY-MM-DD'));
        $("#patient-1-unit").text(patient1.unit);
        $("#patient-1-condition").text(patient1.condition);
        $("#patient-1-gender").text(patient1.gender);
    }
    if (patient2 != null) {
        $("#patient-2-name").text(patient2.name);
        $("#patient-2-pn").text(patient2.personalNumber);
        $("#patient-2-dob").text(moment(patient2.dateOfBirth).format('YYYY-MM-DD'));
        $("#patient-2-adate").text(moment(patient2.admissionDate).format('YYYY-MM-DD'));
        $("#patient-2-ddate").text(moment(patient2.dischargeDate).format('YYYY-MM-DD'));
        $("#patient-2-unit").text(patient2.unit);
        $("#patient-2-condition").text(patient2.condition);
        $("#patient-2-gender").text(patient2.gender);
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
    $("#patient-1-gender").text("");

    $("#patient-2-name").text("");
    $("#patient-2-pn").text("");
    $("#patient-2-dob").text("");
    $("#patient-2-adate").text("");
    $("#patient-2-ddate").text("");
    $("#patient-2-unit").text("");
    $("#patient-2-condition").text("");
    $("#patient-2-gender").text("");
}
