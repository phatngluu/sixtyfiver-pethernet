const mongoose = require("mongoose");
const VaccineDoseSchema = new mongoose.Schema({
    DoseId: {
        type: String,
        require: true,
        unique: true,
    },
    LotNo: {
        type: String,
        require: true,
    },
    VaccineName: String,
    ImportedDate: Date,
    ExpiredDate: Date,
    MedicalUnitHash: String,
    Hash: {
        type: String,
        require: true,
        unique: true,
    }
});

const MedicalUnitSchema = new mongoose.Schema({
    MedCode: {
        type: String,
        require: true,
        unique: true,
    },
    MedName: {
        type: String,
        require: true,
    },
    AccountAddress: String,
    PhysicalAddress: String,
    RegisteredOn: Date,
    VerifiedOn: Date,
    VerificationStatus: {
        type: String,
        enum: ['Unverified', 'Verified', 'Rejected'],
        default: 'Unverified'
    },
    Hash: {
        type: String,
        require: true,
        unique: true,
    }
});

const DoctorSchema = new mongoose.Schema({
    FullName: String,
    CitizenId: {
        type: String,
        require: true,
        unique: true,
    },
    Hash: {
        type: String,
        require: true,
        unique: true,
    }
})

const InjectorSchema = new mongoose.Schema({
    FullName: String,
    Birthday: Date,
    CitizenId: {
        type: String,
        require: true,
        unique: true,
    },
    Address: String,
    PhoneNumber: String,
    Hash: {
        type: String,
        require: true,
        unique: true,
    }
})

const CertificateSchema = new mongoose.Schema({
    MedicalUnitHash: {
        type: String,
        require: true,
    },
    InjectorHash: {
        type: String,
        require: true,
    },
    DoctorHash: {
        type: String,
        require: true,
    },
    VaccineDoseHash: {
        type: String,
        require: true,
    },
    Hash: {
        type: String,
        require: true,
        unique: true,
    }
})

const UserSchema = new mongoose.Schema({
    LegalName: {
        type: String,
        require: true,
        unique: true,
    },
    Username: {
        type: String,
        require: true,
    },
    Password: {
        type: String,
        require: true,
    },
    Sessions: [{
        token: {
            type: String,
            required: true
        },
        expiredAt: {
            type: Number,
            required: true
        }
    }]
})

const VaccineDoseModel = mongoose.model("VaccineDose", VaccineDoseSchema);
const MedicalUnitModel = mongoose.model("MedicalUnit", MedicalUnitSchema);
const DoctorModel = mongoose.model("Doctor", DoctorSchema);
const InjectorModel = mongoose.model("Injector", InjectorSchema);
const CertificateModel = mongoose.model("Certificate", CertificateSchema);
const UserModel = mongoose.model("User", UserSchema);

module.exports = {VaccineDoseModel, MedicalUnitModel, DoctorModel, InjectorModel, CertificateModel, UserModel};
