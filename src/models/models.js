const mongoose = require("mongoose");
const VaccineDoseSchema = new mongoose.Schema({
    LotNo: String,
    VaccineName: String,
    ImportedDate: Date,
    ExpiredDate: Date,
    MedicalUnitHash: String,
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
    CitizenId: String,
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

const CertificateSchema = new mongoose.Schema({
    MedicalUnitHash: String,
    InjectorHash: String,
    DoctorHash: String,
    VaccineDoseHash: String,
    Hash: String,
})

const VaccineDoseModel = mongoose.model("VaccineDose", VaccineDoseSchema);
const MedicalUnitModel = mongoose.model("MedicalUnit", MedicalUnitSchema);
const DoctorModel = mongoose.model("Doctor", DoctorSchema);
const InjectorModel = mongoose.model("Injector", InjectorSchema);
const CertificateModel = mongoose.model("Certificate", CertificateSchema);

module.exports = {VaccineDoseModel, MedicalUnitModel, DoctorModel, InjectorModel, CertificateModel};
