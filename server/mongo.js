const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/manager')
mongoose.set('debug', true)

const PatientSchema = new mongoose.Schema({
    name: String,
    personalNumber: String,
    dateOfBirth: Date,
    admissionDate: Date,
    dischargeDate: Date,
    unit: String
});

const UnitSchema = new mongoose.Schema({
    name: String,
    rooms: [{
        name: String,
        type: String,
        beds: [
            {
                number: String,
                occupied: Boolean,
                patient: String
          }
        ],
        facilities: [String]
    }], 
    nurses: [{
    name: String
    }],
    doctor: [{
        name: String
    }]
});

const Patient = mongoose.model('Patient', PatientSchema)
const Unit = mongoose.model('Unit', UnitSchema)

function addPatient(data) {
    var patient = new Patient(data);
    patient.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("New patient added.");
};

function addPatientToBed(bed, personalNumber, ack){
    
}

function getPatientByID(personalNumber, ack) {
   
}

function getPatientByBed(bedNumber, ack){
   Unit.findOne({'rooms.beds.number':'bedNumber'}, function(err, data){
       if(err){
           console.log(err);
       }
       else{
           console.log(data.patient);
           ack(data.patient);
       }
   })
}

function getAllPatients(ack){
    Patient.find({}, function(err, data){
        if(err){
            console.log(err);
        } else ack(data);
    })
}

exports.addPatient = addPatient
exports.getPatientByBed = getPatientByBed
exports.getPatientByID = getPatientByID
exports.getAllPatients = getAllPatients