import { Team, User, Patient, Notification } from '../patientlist-db/schema';
import mongoose from 'mongoose';
import { updatePatient } from './patient-dao.js'

// retrieve team 
async function retrieveTeam(teamId) {
    const result = await Team.findOne({ _id: teamId }).populate('clinicians').populate('patients');
    return result;
}

// retrieve all teams
async function retrieveAllTeams() {
    const result = await Team.find({}).populate('clinicians').populate('patients');
    return result;
}

// retrieve patient list from Team collection
async function retrievePatientList(teamId) {

    const result = await Team.findOne({ _id: teamId }, { patients: 1 })
        .populate('patients');
    return result.patients;
}

// retrieve team member list from Team collection
async function retrieveClinicianList(teamId) {

    const result = await Team.findOne({ id: teamId }, { clinicians: 1 })
        .populate('clinicians');
    return result.clinicians;
}


async function retrieveTeamByPatientId(id) {
    return await Team.findOne({ patients: mongoose.Types.ObjectId(id) });
}

async function transferTeam(patientId, supervisorId) {
    // get supervisor user
    const supervisor = await User.findById(supervisorId);
    const teamId = supervisor.team;

    // get current team
    const currentTeam = await Team.findOne({ patients: mongoose.Types.ObjectId(patientId) });
    if (!currentTeam) {
        return;
    }

    // get new team
    const newTeam =  await Team.findById(teamId);
    if (!newTeam) {
        return;
    }

    // remove patient from old team
    const currentTeamPatients = currentTeam.patients
    const index = currentTeamPatients.indexOf(patientId);
    currentTeamPatients.splice(index, 1);
    await Team.findByIdAndUpdate(currentTeam._id, {patients: currentTeamPatients}, { new: false });

    // add patient to new team
    const newTeamPatients = newTeam.patients
    await Team.findByIdAndUpdate(newTeam._id, {patients: [...newTeamPatients, patientId]}, { new: false });

    // update stupid supervisor id in patient
    await Patient.findByIdAndUpdate(patientId, {responsibleClinicians: mongoose.Types.ObjectId(supervisorId)}, { new: false });

    // notification update when patient team change
    const currentTeamClinicians = currentTeam.clinicians;
    const patient = await Patient.findOne({_id:patientId});

     // For current team
    const notificationForCurrentTeam = new Notification({
        type:'Admin',
        patient:patient,
        entity:'You have a patient transfer to another team, ',
        isRead:false
    });

    await notificationForCurrentTeam.save();

    for (const clinician of currentTeamClinicians){
        notificationForCurrentTeam.recipient.push(clinician);
        const user = await User.findOne({_id:clinician._id})
        user.notification.push(notificationForCurrentTeam);
        await notificationForCurrentTeam.save();
        await user.save();
    }
   
    // For new team
    const newTeamClinicians = newTeam.clinicians;
    const notificationForNewTeam = new Notification({
        type:'Admin',
        patient:patient,
        entity:'You have a new patient, ',
        isRead:false
    });
    await notificationForNewTeam.save();

    for (const clinician of newTeamClinicians){
        notificationForNewTeam.recipient.push(clinician);
        const user = await User.findOne({_id:clinician._id})
        user.notification.push(notificationForNewTeam);
        await notificationForNewTeam.save();
        await user.save();
    }

    // retrieveTeamByPatientId
    return await Team.findOne({ patients: mongoose.Types.ObjectId(patientId) });
}


export {
    retrieveTeam,
    retrieveAllTeams,
    retrievePatientList,
    retrieveClinicianList,
    retrieveTeamByPatientId,
    transferTeam
};