import mongoose from 'mongoose';

import { Patient, User, Team, Task, Notification } from "../patientlist-db/schema";
import { getUserById } from "./user-dao";

async function retrievePatient(id) {
    return await Patient.findById(id);
}

async function updatePatient(id, data) {
    const updatedPatient = await Patient.findByIdAndUpdate(id, data, { new: false });

    return updatedPatient !== undefined;
}

async function deletePatient(id) {

    // Remove patient from team
    const team = await Team.findOne({ patients: mongoose.Types.ObjectId(id) });
    if (team) {
        const update = { $pull: { patients: id } };
        await Team.findByIdAndUpdate(team._id, update, { new: false });
    }

    // Remove patient tasks
    await Task.deleteMany({ patient: mongoose.Types.ObjectId(id) });

    // Remove patient notifications
    await Notification.deleteMany({ patient: mongoose.Types.ObjectId(id) });

    // Remove patient
    return await Patient.deleteOne({ _id: mongoose.Types.ObjectId(id) });
}

async function addPatient(data) {
    // add patient identifier
    const UPIFirst = data.fname.toUpperCase().slice(0, 1);
    const UPILast = data.lname.toUpperCase().slice(0, 2);
    const UPINumeric = Math.floor(Math.random() * (10000 - 1000) + 1000);
    const UPI = UPIFirst + UPILast + UPINumeric.toString()

    const patient = new Patient({
        fname: data.fname,
        lname: data.lname,
        location: data.location,
        description: data.description,
        responsibleClinicians: data.responsibleClinicians,
        quickAdd: data.quickAdd,
        birth_date: data.birth_date,
        gender: data.gender,
        identifier: UPI
    })
    await patient.save();

    addPatientToTeam(patient._id, patient.responsibleClinicians);

    // notify supervisor & team members new patient has been added
    if (data.notification == 'on') {
        const team = await Team.findOne({ supervisors: data.responsibleClinicians }).populate();

        const clinicians = team.clinicians;

        const notification = new Notification({
            type: 'Admin',
            patient: patient,
            entity: 'You have a new patient, ',
            isRead: false
        });

        await notification.save();
        for (const clinician of clinicians) {
            notification.recipient.push(clinician);
            const user = await User.findOne({ _id: clinician._id })
            user.notification.push(notification);
            await notification.save();
            await user.save();
        }
    }

    return patient;
}

// add new patient to team
async function addPatientToTeam(patientId, supervisorId) {
    const team = await Team.findOne({ supervisors: supervisorId });
    team.patients.push(patientId);
    await team.save();
}

// get supervisor(responsible clinicians) based on userId
async function getCliniciansByUserId(id) {
    let data = [];
    const team = await Team.findOne({ clinicians: id });
    const clinicians = team.supervisors;
    await Promise.all(clinicians.map(async (c) => {
        const user = await getUserById(c);
        data.push({
            id: user.id,
            fname: user.fname,
            lname: user.lname,
        });
    }));
    return data;
}

export {
    addPatient, getCliniciansByUserId, updatePatient, retrievePatient, deletePatient
}