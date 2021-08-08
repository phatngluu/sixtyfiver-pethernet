const mongoose = require("mongoose");
const VaccineDoseSchema = new mongoose.Schema({
    LotNo: String,
    VaccineName: String,
    ImportedDate: Date,
    ExpiredDate: Date,
    Hash: String
});

const MedicalUnitSchema = new mongoose.Schema({
    MedCode: String,
    Address: String,
    Contact: String,
    RegisteredOn: Date,
    Hash: String,
});

const DoctorSchema = new mongoose.Schema({
    FullName: String,
    Hash: String,
})

const InjectorSchema = new mongoose.Schema({
    FullName: String,
    Birthday: Date,
    CitizenId: String,
    Address: String,
    PhoneNumber: String,
    Hash: String,
})

const VaccineDoseModel = mongoose.model("VaccineDose", VaccineDoseSchema);
const MedicalUnitModel = mongoose.model("MedicalUnit", MedicalUnitSchema);
const DoctorModel = mongoose.model("Doctor", DoctorSchema);
const InjectorModel = mongoose.model("Injector", InjectorSchema);

module.exports = {VaccineDoseModel, MedicalUnitModel, DoctorModel, InjectorModel};
