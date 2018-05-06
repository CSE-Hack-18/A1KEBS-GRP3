const mongoose = require('mongoose')

mongoose.connect('mongodb://hospital:hospital1@ds021046.mlab.com:21046/heroku_483f69hg')
mongoose.set('debug', true)

const PatientSchema = new mongoose.Schema({
    name: String,
    personalNumber: String,
    dateOfBirth: Date,
    admissionDate: Date,
    dischargeDate: Date,
    unit: String,
    condition: String,
    nurse: String
});

const UnitSchema = new mongoose.Schema({
    name: String,
    nurses: [{
        name: String,
        experience: String,
        number: String
    }]
});

var BedSchema = new mongoose.Schema({
    number: String,
    occupied: Boolean,
    patient: String
});

const RoomSchema = new mongoose.Schema({
    unit: String,
    name: String,
    type: String,
    beds: [BedSchema],
    facilities: [{
        type: String
    }]
});

const Patient = mongoose.model('Patient', PatientSchema)
const Unit = mongoose.model('Unit', UnitSchema)
const Room = mongoose.model('Room', RoomSchema)

function addPatient(data) {
    var patient = new Patient(data);
    patient.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("New patient added.");
};

function addPatientToBed(bed, personalNumber) {
    Room.update({
            'beds.number': bed
        }, {
            '$set': {
                'beds.$.occupied': true,
                'beds.$.patient': personalNumber
            }
        },
        function (err) {
            if (err) {
                console.log(err);
            }
        }
    );
}

function getPatientByID(personalNumber, ack) {
    Patient.findOne({
        personalNumber: personalNumber
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            ack(data);
        }
    });
}

function getPatientByBed(bedNumber, ack) {
    Room.findOne({
        'beds.number': bedNumber
    }, {
        'beds.$': 1
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data === null) {
                console.log("Bed is empty.");
                return "";
            } else {
                getPatientByID(data.beds[0].patient, function (person) {
                    ack(person);
                });
            }
        }
    })
}

function getAllPatients(ack) {
    Patient.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else ack(data);
    })
}

function getAllPatientsByUnit(unit, ack) {
    Patient.find({unit: unit}, function (err, data) {
        if (err) {
            console.log(err);
        } else ack(data);
    })
}

function getAllRooms(unitName, ack) {
    Room.find({
            unit: unitName
        },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                ack(data);
            }
        })
}

function getNurses(ack) {
    Unit.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else ack(data.nurses);
    });
}

exports.addPatient = addPatient
exports.getPatientByBed = getPatientByBed
exports.getPatientByID = getPatientByID
exports.getAllPatients = getAllPatients
exports.addPatientToBed = addPatientToBed
exports.getAllRooms = getAllRooms
exports.getNurses = getNurses
exports.getAllPatientsByUnit = getAllPatientsByUnit
