import {Patient, User, Task, Team} from '../patientlist-db/schema.js';

//find supervisor by team
async function findSupervisorByTeam(teamId) {
    const supervisor = await Team.find({teams: teamId}, { supervisors: 1});
    return supervisor;
}

// find all users by team
async function findUsersByTeam(teamId) {
    const users = await Team.find({teams: teamId}, { clinicians: 1});
    return users;
}

// retrieve patient list from Team collection
async function retrievePatientList(teamId) {

    const result = await Team.findOne({ id: teamId }, { patients: 1 })
        .populate('patients');
    return result.patients;
}

// find all tasks by team
async function findTasksByTeam(teamId) {
    //find all patients by team
    const patients = await findPatientsByTeam(teamId);

    //find all tasks for each patient
    const tasks = []
    for (let patient of patients) {
        const tempTask = await Task.find({patient: patient});
        tasks.push(tempTask);
    }
    return tasks;
}

// find all done tasks in a team within seven days of current data
async function findSevenDayDoneTasksInTeam(teamId) {
    //find all patients in a team
    const patients = await findPatientsByTeam(teamId);

    //find all tasks for each patient
    const tasks = []
    for (let patient of patients) {
        const tempTask = await Task.find({patient: patient, finished_at: {$gte: new Date(Date.now() - 7*24*60*60*1000)}});
        tasks.push(tempTask);
    }
    return tasks;
}

// find all done tasks by a user within seven days of current data
async function findSevenDayDoneTasksByUser(userId) {
    //find all tasks for each clinician 
    const tasks = await Task.find({clinician: userId, finished_at: {$gte: new Date(Date.now() - 7*24*60*60*1000)}});
    return tasks;

}

export {
    retrievePatientList
}


