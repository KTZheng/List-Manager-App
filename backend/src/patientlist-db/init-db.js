import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';


import { Patient, User, Team, Notification, Task } from './schema';
import { patient, user, team } from '../data/dummy-data';
import { notification } from '../data/notification-data';
import { task } from '../data/task-data';
import bcrypt from 'bcrypt';

mongoose.set('strictQuery', false);

// Initialize the database
async function run() {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

    console.log('Clearing db...');
    // Clear the database by deleting all Pokedex entries
    await clearDatabase();


    console.log('Adding data...');
    await addPatient();
    await addUser();
    await addTeam();
    await addResponsibleClinicians();
    await addTasks();
    await addNotification();


    await mongoose.disconnect();
    console.log('Done!');
}

run();

async function clearDatabase() {
    const patientsDeleted = await Patient.deleteMany({});
    console.log(`Cleared database (removed ${patientsDeleted.deletedCount} patients).`)
    const usersDelete = await User.deleteMany({});
    console.log(`Cleared database (removed ${usersDelete.deletedCount} users).`)
    const teamsDelete = await Team.deleteMany({});
    console.log(`Cleared database (removed ${teamsDelete.deletedCount} teams).`)
    const taskDelete = await Task.deleteMany({});
    console.log(`Cleared database (removed ${taskDelete.deletedCount} tasks).`)
    const notificationDelete = await Notification.deleteMany({});
    console.log(`Cleared database (removed ${notificationDelete.deletedCount} notifications).`)
}

async function addPatient() {
    for (const data of patient) {
        const dbPatient= new Patient(data);

        await dbPatient.save();
    }
}

async function addUser() {
    for (const data of user) {
        let password = await bcrypt.hash(data.password, 10);

        const dbUser = new User(data);

        dbUser.password = password;

        await dbUser.save();
      }
}

async function addTeam() {
    const clinicians = await User.find();

    let index = 0;
    let teamSize = clinicians.length / team.length;
    let initialValue = 0;

    for (const data of team) {
        const supervisor = await User.find({ isSupervisor: true });
        const dbSupervisor = await User.findOne(supervisor[index]._id);
        index++;

        const dbTeam = new Team(data);

        dbTeam.supervisors = dbSupervisor._id;

        const dbClinicians = clinicians.slice(initialValue, initialValue + teamSize);
     
        initialValue+=teamSize;
      
        for (const user of dbClinicians) {
            dbTeam.clinicians.push(user._id);
            user.team = dbTeam._id;
            await user.save();
        }

        await dbTeam.save();
    }

}

async function addResponsibleClinicians() {
    const teams = await Team.find();
    const patients = await Patient.find();
    let supervisors = [];
    for (const team of teams) {
        let s = team.supervisors;
        s.forEach(element => {
            supervisors.push(element);
        });
    }

    for (const patient of patients) {
        const randomNum = Math.floor(Math.random() * supervisors.length);
        patient.responsibleClinicians = supervisors[randomNum];

        // add patient identifier
        const UPIFirst = patient.fname.toUpperCase().slice(0, 1);
        const UPILast = patient.lname.toUpperCase().slice(0, 2);
        const UPINumeric = Math.floor(Math.random() * (10000 - 1000) + 1000);
        const UPI = UPIFirst + UPILast + UPINumeric.toString()
        patient.identifier = UPI;
        const team = await Team.findOne({ supervisors: supervisors[randomNum] });
        team.patients.push(patient)
        await team.save();
        await patient.save();
    }
}

async function addTasks() {
    const teams = await Team.find();
    for (const data of task) {
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        const teamPatients = randomTeam.patients;
        const teamClinicians = randomTeam.clinicians;
        const randomPatient = Math.floor(Math.random() * teamPatients.length);
        const randomClinician = Math.floor(Math.random() * teamClinicians.length);
        randomTeam.patients.slice(randomPatient);
        const newTask = {
            ...data,
            patient: teamPatients[randomPatient],
            clinician: teamClinicians[randomClinician],
            finished_at: Date.now() - Math.floor(Math.random() * 6 * 24 * 60 * 60 * 1000)
        }
        const dbTask = new Task(newTask);
        await dbTask.save();
    }
}

async function addNotification(){
    const tasks = await Task.find({ status:0 });

    for (const task of tasks){
        const user = await User.findOne({_id: task.clinician._id});
        const patient = await Patient.findOne({_id: task.patient._id});
        const newNotification = {
            type: 'Task',
            recipient:user,
            patient:patient,
            isRead:false,
            entity:task.type + ' needed for ',
            created_at:task.created_at,
        }
        const dbNotification = new Notification(newNotification);
        await dbNotification.save();

        user.notification.push(dbNotification);
        patient.notification.push(dbNotification);
        await user.save();
        await patient.save();

    }
    const taskRead = await Task.find({ status: {$in:(1,2) } });

    for (const task of taskRead){
        const user = await User.findOne({_id: task.clinician._id});
        const patient = await Patient.findOne({_id: task.patient._id});
        const newNotification = {
            type: 'Task',
            recipient:user,
            patient:patient,
            isRead:true,
            entity:task.type + ' needed for ',
            created_at:task.created_at,
        }
        const dbNotification = new Notification(newNotification);
        await dbNotification.save();

        user.notification.push(dbNotification);
        patient.notification.push(dbNotification);
        await user.save();
        await patient.save();

    }
}
