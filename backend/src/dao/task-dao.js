import { Task, User,Patient, Team, Notification } from "../patientlist-db/schema.js";
import dayjs from 'dayjs';
import mongoose from 'mongoose';

async function retrieveTasks() {
    return await Task.find().populate('patient').populate('clinician');
}

async function retrieveTask(id) {
    return await Task.findById(id);
}

async function retrieveTasksByPatientId(id) {
    return await Task.find({ patient: mongoose.Types.ObjectId(id) }).populate('patient').populate('clinician');
}

async function updateTask(id, data) {
    const updatedTask = await Task.findByIdAndUpdate(id, data, { new: false });
    
    return updatedTask !== undefined;
}

async function deleteTask(id) {
    await Task.deleteOne({ _id: id });
}

async function createTask(task) {
    const dbTask = new Task(task);
    await dbTask.save();

    // Notification update
    const patient = await Patient.findOne(dbTask.patient)

    const responsibleClinician = await User.find(patient.responsibleClinicians)
    const team = await Team.findOne({supervisors:responsibleClinician})
    const clinicians = team.clinicians
    const entity = dbTask.type + ' needed for '
    const notification = new Notification({
        type:'Task',
        patient:patient,
        entity: entity,
        isRead:false
    });
    await notification.save();
    for (const clinician of clinicians){
        notification.recipient.push(clinician);
        const user = await User.findOne({_id:clinician._id})
        user.notification.push(notification);
        await notification.save();
        await user.save();
    }

    return dbTask !== undefined;
}

// retrieve tasks that have already been completed within the last 7 days
async function retrieveCompletedTasks(clinicianId) {
    const tasks = await Task.find({clinician: clinicianId});
    const completedTasks = tasks.filter(task => dayjs(task.completedAt).isAfter(dayjs().subtract(7, 'day')));
    return completedTasks;
}

export {
    retrieveTasks,
    retrieveTask,
    updateTask,
    deleteTask,
    createTask,
    retrieveCompletedTasks,
    retrieveTasksByPatientId
};
