// import mongoose from 'mongoose';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Patient, User, Task, Team, Notification } from '../schema';
import {
    retrievePatient,
    updatePatient,
    deletePatient
} from '../../dao/patient-dao';

// Test data
const patients = [
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000001'),
        fname: 'Laureen',
        lname: 'Lance',
        identifier: 'AAA1234',
        description: 'testPatient1',
        location: 'testLocation1',
        responsibleClinicians: new mongoose.Types.ObjectId('000000000000000000000011'),
        quickAdd: 'blood-test',
        notification: [new mongoose.Types.ObjectId('000000000000000000000041')],
        created_at: new Date('2023-05-06T00:00:00.000Z'),
        progress: {
            problems: 'testProblem1',
            history: 'testHistory1',
            plan: 'testPlan1',
        },
        birth_date: new Date('1983-05-07T00:00:00.000Z'),
        gender: 'Female',
        container: 'testContainer1'
    },
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000002'),
        fname: 'Bram',
        lname: 'Gene',
        identifier: 'AAA1234',
        description: 'testPatient2',
        location: 'testLocation2',
        responsibleClinicians: new mongoose.Types.ObjectId('000000000000000000000012'),
        quickAdd: 'blood-test',
        notification: [new mongoose.Types.ObjectId('000000000000000000000042')],
        created_at: new Date('2023-05-07T00:00:00.000Z'),
        progress: {
            problems: 'testProblem2',
            history: 'testHistory2',
            plan: 'testPlan2',
        },
        birth_date: new Date('1983-12-31T00:00:00.000Z'),
        gender: 'Male',
        container: 'testContainer2'
    }

];

const users = [
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000011'),
        fname: 'Jingyi',
        lname: 'You',
        phone: 1234567890,
        email: 'testEmail1',
        password: 'testPassword1',
        isSupervisor: false,
        isAdmin: false,
        role: 'testRole1',
        avatar: 'testAvatar1',
        notification: [new mongoose.Types.ObjectId('000000000000000000000041')],
        created_at: new Date('2023-05-06T00:00:00.000Z'),
        team: new mongoose.Types.ObjectId('000000000000000000000031'),
    },
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000012'),
        fname: 'Jiewen',
        lname: 'Li',
        phone: 1234567891,
        email: 'testEmail2',
        password: 'testPassword2',
        isSupervisor: false,
        isAdmin: true,
        role: 'testRole2',
        avatar: 'testAvatar2',
        notification: [new mongoose.Types.ObjectId('000000000000000000000042')],
        created_at: new Date('2023-05-07T00:00:00.000Z'),
        team: new mongoose.Types.ObjectId('000000000000000000000031'),
    }

]

const tasks = [
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000021'),
        name: 'testTask1',
        type: 'testType1',
        patient: new mongoose.Types.ObjectId('000000000000000000000001'),
        clinician: new mongoose.Types.ObjectId('000000000000000000000011'),
        notification: [new mongoose.Types.ObjectId('000000000000000000000041')],
        priority: 0,
        created_at: new Date('2023-05-06T00:00:00.000Z'),
        finished_at: null,
        status: 0,
        result: ''
    },
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000022'),
        name: 'testTask2',
        type: 'testType2',
        patient: new mongoose.Types.ObjectId('000000000000000000000002'),
        clinician: new mongoose.Types.ObjectId('000000000000000000000012'),
        notification: [new mongoose.Types.ObjectId('000000000000000000000042')],
        priority: 1,
        created_at: new Date('2023-05-07T00:00:00.000Z'),
        finished_at: new Date('2023-05-07T00:00:00.000Z'),
        status: 1,
        result: 'testResult2'
    }

];

const teams = [
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000031'),
        name: 'testTeam1',
        patients: [new mongoose.Types.ObjectId('000000000000000000000001')],
        clinicians: [new mongoose.Types.ObjectId('000000000000000000000011')],
        supervisors: [new mongoose.Types.ObjectId('000000000000000000000011')]
    },
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000032'),
        name: 'testTeam2',
        patients: [new mongoose.Types.ObjectId('000000000000000000000002')],
        clinicians: [new mongoose.Types.ObjectId('000000000000000000000012')],
        supervisors: [new mongoose.Types.ObjectId('000000000000000000000012')]
    }
];

const notifications = [
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000041'),
        type: 'testType1',
        recipient: [new mongoose.Types.ObjectId('000000000000000000000011')],
        patient: new mongoose.Types.ObjectId('000000000000000000000001'),
        entity: 'testEntity1',
        isRead: false,
        created_at: new Date('2023-05-06T00:00:00.000Z'),
    },
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000042'),
        type: 'testType2',
        recipient: [new mongoose.Types.ObjectId('000000000000000000000012')],
        patient: new mongoose.Types.ObjectId('000000000000000000000002'),
        entity: 'testEntity2',
        isRead: true,
        created_at: new Date('2023-05-07T00:00:00.000Z'),
    }
];

let mongod;

/**
 * Before all tests, create an in-memory MongoDB instance
 */
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const conncetionString = mongod.getUri();
    await mongoose.connect(conncetionString, { useNewUrlParser: true });
})

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
    //Drop existing collections
    await mongoose.connection.db.dropDatabase();

    await Patient.insertMany(patients);
    await User.insertMany(users);
    await Task.insertMany(tasks);
    await Team.insertMany(teams);
    await Notification.insertMany(notifications);
})

/**
* After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

describe('Patient schema test', () => {
    /**
     * Ensure all patient data can be obtained
     */

    it('gets all patients', async () => {
        const patientsFromDB = await Patient.find({});

        expect(patientsFromDB).toBeTruthy();
        expect(patientsFromDB.length).toBe(2);

        for (let i = 0; i < patientsFromDB.length; i++) {
            expect(patientsFromDB[i]._id).toEqual(patients[i]._id);
            expect(patientsFromDB[i].fname).toEqual(patients[i].fname);
            expect(patientsFromDB[i].lname).toEqual(patients[i].lname);
            expect(patientsFromDB[i].identifier).toEqual(patients[i].identifier);
            expect(patientsFromDB[i].description).toEqual(patients[i].description);
            expect(patientsFromDB[i].location).toEqual(patients[i].location);
            expect(patientsFromDB[i].responsibleClinicians).toEqual(patients[i].responsibleClinicians);
            expect(patientsFromDB[i].quickAdd).toEqual(patients[i].quickAdd);
            expect(patientsFromDB[i].notification).toEqual(patients[i].notification);
            expect(patientsFromDB[i].created_at).toEqual(patients[i].created_at);
            expect(patientsFromDB[i].progress).toEqual(patients[i].progress);
            expect(patientsFromDB[i].birth_date).toEqual(patients[i].birth_date);
            expect(patientsFromDB[i].gender).toEqual(patients[i].gender);
            expect(patientsFromDB[i].container).toEqual(patients[i].container);
        }
    });

    /**
     * Ensure a patient can be obtained by id
     */
    it('gets a patient by id', async () => {
        const patientFromDB = await Patient.findById('000000000000000000000001');

        expect(patientFromDB).toBeTruthy();
        expect(patientFromDB._id).toEqual(patients[0]._id);
        expect(patientFromDB.fname).toEqual(patients[0].fname);
        expect(patientFromDB.lname).toEqual(patients[0].lname);
        expect(patientFromDB.identifier).toEqual(patients[0].identifier);
        expect(patientFromDB.description).toEqual(patients[0].description);
        expect(patientFromDB.location).toEqual(patients[0].location);
        expect(patientFromDB.responsibleClinicians).toEqual(patients[0].responsibleClinicians);
        expect(patientFromDB.quickAdd).toEqual(patients[0].quickAdd);
        expect(patientFromDB.notification).toEqual(patients[0].notification);
        expect(patientFromDB.created_at).toEqual(patients[0].created_at);
        expect(patientFromDB.progress).toEqual(patients[0].progress);
        expect(patientFromDB.birth_date).toEqual(patients[0].birth_date);
        expect(patientFromDB.gender).toEqual(patients[0].gender);
        expect(patientFromDB.container).toEqual(patients[0].container);
    });

    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */

    it('returns null when requesting for an invalid id', async () => {
        const patientFromDB = await Patient.findById('000000000000000000000003');
        expect(patientFromDB).toBeNull();
    });


});

describe('User schema test', () => {

    /**
     * Ensure all user data can be obtained
     */
    it('gets all users', async () => {

        const usersFromDB = await User.find({});
        expect(usersFromDB).toBeTruthy();
        expect(usersFromDB.length).toBe(2);

        for (let i = 0; i < usersFromDB.length; i++) {
            expect(usersFromDB[i]._id).toEqual(users[i]._id);
            expect(usersFromDB[i].fname).toEqual(users[i].fname);
            expect(usersFromDB[i].lname).toEqual(users[i].lname);
            expect(usersFromDB[i].phone).toEqual(users[i].phone);
            expect(usersFromDB[i].email).toEqual(users[i].email);
            expect(usersFromDB[i].password).toEqual(users[i].password);
            expect(usersFromDB[i].isSupervisor).toEqual(users[i].isSupervisor);
            expect(usersFromDB[i].isAdmin).toEqual(users[i].isAdmin);
            expect(usersFromDB[i].role).toEqual(users[i].role);
            expect(usersFromDB[i].avatar).toEqual(users[i].avatar);
            expect(usersFromDB[i].notification).toEqual(users[i].notification);
            expect(usersFromDB[i].created_at).toEqual(users[i].created_at);
            expect(usersFromDB[i].team).toEqual(users[i].team);
        }
    });

    /**
     * Ensure a user can be obtained by id
     */
    it('gets a user by id', async () => {
        const userFromDB = await User.findById('000000000000000000000011');

        expect(userFromDB).toBeTruthy();
        expect(userFromDB._id).toEqual(users[0]._id);
        expect(userFromDB.fname).toEqual(users[0].fname);
        expect(userFromDB.lname).toEqual(users[0].lname);
        expect(userFromDB.phone).toEqual(users[0].phone);
        expect(userFromDB.email).toEqual(users[0].email);
        expect(userFromDB.password).toEqual(users[0].password);
        expect(userFromDB.isSupervisor).toEqual(users[0].isSupervisor);
        expect(userFromDB.isAdmin).toEqual(users[0].isAdmin);
        expect(userFromDB.role).toEqual(users[0].role);
        expect(userFromDB.avatar).toEqual(users[0].avatar);
        expect(userFromDB.notification).toEqual(users[0].notification);
        expect(userFromDB.created_at).toEqual(users[0].created_at);
        expect(userFromDB.team).toEqual(users[0].team);

    });

    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */
    it('returns null when requesting for an invalid id', async () => {

        const userFromDB = await User.findById('000000000000000000000013');
        expect(userFromDB).toBeNull();
    });

    /**
     * Ensure a user can be obtained by id
     */
    it('gets a user by id', async () => {
        const userFromDB = await User.findById('000000000000000000000011');

        expect(userFromDB).toBeTruthy();
        expect(userFromDB._id).toEqual(users[0]._id);
        expect(userFromDB.fname).toEqual(users[0].fname);
        expect(userFromDB.lname).toEqual(users[0].lname);
        expect(userFromDB.phone).toEqual(users[0].phone);
        expect(userFromDB.email).toEqual(users[0].email);
        expect(userFromDB.password).toEqual(users[0].password);
        expect(userFromDB.isSupervisor).toEqual(users[0].isSupervisor);
        expect(userFromDB.isAdmin).toEqual(users[0].isAdmin);
        expect(userFromDB.role).toEqual(users[0].role);
        expect(userFromDB.avatar).toEqual(users[0].avatar);
        expect(userFromDB.notification).toEqual(users[0].notification);
        expect(userFromDB.created_at).toEqual(users[0].created_at);
        expect(userFromDB.team).toEqual(users[0].team);

    });

    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */
    it('returns null when requesting for an invalid id', async () => {

        const userFromDB = await User.findById('000000000000000000000013');
        expect(userFromDB).toBeNull();
    });

    /**
     * Ensure a user can be obtained by id
     */
    it('gets a user by id', async () => {
        const userFromDB = await User.findById('000000000000000000000011');

        expect(userFromDB).toBeTruthy();
        expect(userFromDB._id).toEqual(users[0]._id);
        expect(userFromDB.fname).toEqual(users[0].fname);
        expect(userFromDB.lname).toEqual(users[0].lname);
        expect(userFromDB.phone).toEqual(users[0].phone);
        expect(userFromDB.email).toEqual(users[0].email);
        expect(userFromDB.password).toEqual(users[0].password);
        expect(userFromDB.isSupervisor).toEqual(users[0].isSupervisor);
        expect(userFromDB.isAdmin).toEqual(users[0].isAdmin);
        expect(userFromDB.role).toEqual(users[0].role);
        expect(userFromDB.avatar).toEqual(users[0].avatar);
        expect(userFromDB.notification).toEqual(users[0].notification);
        expect(userFromDB.created_at).toEqual(users[0].created_at);
        expect(userFromDB.team).toEqual(users[0].team);

    });

    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */
    it('returns null when requesting for an invalid id', async () => {

        const userFromDB = await User.findById('000000000000000000000013');
        expect(userFromDB).toBeNull();
    });

    /**
     * Ensure a user can be obtained by id
     */
    it('gets a user by id', async () => {
        const userFromDB = await User.findById('000000000000000000000011');

        expect(userFromDB).toBeTruthy();
        expect(userFromDB._id).toEqual(users[0]._id);
        expect(userFromDB.fname).toEqual(users[0].fname);
        expect(userFromDB.lname).toEqual(users[0].lname);
        expect(userFromDB.phone).toEqual(users[0].phone);
        expect(userFromDB.email).toEqual(users[0].email);
        expect(userFromDB.password).toEqual(users[0].password);
        expect(userFromDB.isSupervisor).toEqual(users[0].isSupervisor);
        expect(userFromDB.isAdmin).toEqual(users[0].isAdmin);
        expect(userFromDB.role).toEqual(users[0].role);
        expect(userFromDB.avatar).toEqual(users[0].avatar);
        expect(userFromDB.notification).toEqual(users[0].notification);
        expect(userFromDB.created_at).toEqual(users[0].created_at);
        expect(userFromDB.team).toEqual(users[0].team);

    });

    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */
    it('returns null when requesting for an invalid id', async () => {

        const userFromDB = await User.findById('000000000000000000000013');
        expect(userFromDB).toBeNull();
    });



});

describe('Task Schema Test', () => {
    /**
     * Ensure all task data can be obtained 
     */
    it('gets all tasks', async () => {
        const tasksFromDB = await Task.find();

        expect(tasksFromDB).toBeTruthy();
        expect(tasksFromDB.length).toEqual(tasks.length);

        tasksFromDB.forEach((taskFromDB, i) => {
            expect(taskFromDB._id).toEqual(tasks[i]._id);
            expect(taskFromDB.name).toEqual(tasks[i].name);
            expect(taskFromDB.type).toEqual(tasks[i].type);
            expect(taskFromDB.patient).toEqual(tasks[i].patient);
            expect(taskFromDB.clinician).toEqual(tasks[i].clinician);
            expect(taskFromDB.priority).toEqual(tasks[i].priority);
            expect(taskFromDB.notification).toEqual(tasks[i].notification);
            expect(taskFromDB.created_at).toEqual(tasks[i].created_at);
            expect(taskFromDB.finished_at).toEqual(tasks[i].finished_at);
            expect(taskFromDB.status).toEqual(tasks[i].status);
            expect(taskFromDB.result).toEqual(tasks[i].result);
        });
    });

    /**
     * Ensure a task can be obtained by id
     */

    it('gets a task by id', async () => {
        const taskFromDB = await Task.findById('000000000000000000000021');

        expect(taskFromDB).toBeTruthy();
        expect(taskFromDB._id).toEqual(tasks[0]._id);
        expect(taskFromDB.name).toEqual(tasks[0].name);
        expect(taskFromDB.type).toEqual(tasks[0].type);
        expect(taskFromDB.patient).toEqual(tasks[0].patient);
        expect(taskFromDB.clinician).toEqual(tasks[0].clinician);
        expect(taskFromDB.priority).toEqual(tasks[0].priority);
        expect(taskFromDB.notification).toEqual(tasks[0].notification);
        expect(taskFromDB.created_at).toEqual(tasks[0].created_at);
        expect(taskFromDB.finished_at).toEqual(tasks[0].finished_at);
        expect(taskFromDB.status).toEqual(tasks[0].status);
        expect(taskFromDB.result).toEqual(tasks[0].result);
    });


    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */
    it('returns null when requesting for an invalid id', async () => {

        const taskFromDB = await Task.findById('000000000000000000000020');
        expect(taskFromDB).toBeNull();
    });


});

describe('Team Schema Test', () => {
    /**
     * Ensure all team data can be obtained 
     */
    it('gets all teams', async () => {
        const teamsFromDB = await Team.find();

        expect(teamsFromDB).toBeTruthy();
        expect(teamsFromDB.length).toEqual(teams.length);

        teamsFromDB.forEach((teamFromDB, i) => {
            expect(teamFromDB._id).toEqual(teams[i]._id);
            expect(teamFromDB.name).toEqual(teams[i].name);
            expect(teamFromDB.members).toEqual(teams[i].members);
            expect(teamFromDB.created_at).toEqual(teams[i].created_at);
        });
    });

    /**
     * Ensure a team can be obtained by id
     */

    it('gets a team by id', async () => {
        const teamFromDB = await Team.findById('000000000000000000000031');

        expect(teamFromDB).toBeTruthy();
        expect(teamFromDB._id).toEqual(teams[0]._id);
        expect(teamFromDB.name).toEqual(teams[0].name);
        expect(teamFromDB.patients).toEqual(teams[0].patients);
        expect(teamFromDB.clinicians).toEqual(teams[0].clinicians);
        expect(teamFromDB.supervisors).toEqual(teams[0].supervisors);
    });

    /**
     * Ensure that a team can be obtained by id
     */

    it('gets a team by id', async () => {
        const teamFromDB = await Team.findById('000000000000000000000031');

        expect(teamFromDB).toBeTruthy();
        expect(teamFromDB._id).toEqual(teams[0]._id);
        expect(teamFromDB.name).toEqual(teams[0].name);
        expect(teamFromDB.patients).toEqual(teams[0].patients);
        expect(teamFromDB.clinicians).toEqual(teams[0].clinicians);
        expect(teamFromDB.supervisors).toEqual(teams[0].supervisors);

    });

    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */
    it('returns null when requesting for an invalid id', async () => {

        const teamFromDB = await Team.findById('000000000000000000000030');
        expect(teamFromDB).toBeNull();
    });

});

describe('Notification Schema Test', () => {
    /**
     * Ensure all notification data can be obtained 
     */
    it('gets all notifications', async () => {
        const notificationsFromDB = await Notification.find();

        expect(notificationsFromDB).toBeTruthy();
        expect(notificationsFromDB.length).toEqual(notifications.length);

        notificationsFromDB.forEach((notificationFromDB, i) => {
            expect(notificationFromDB._id).toEqual(notifications[i]._id);
            expect(notificationFromDB.type).toEqual(notifications[i].type);
            expect(notificationFromDB.recipient).toEqual(notifications[i].recipient);
            expect(notificationFromDB.patient).toEqual(notifications[i].patient);
            expect(notificationFromDB.entity).toEqual(notifications[i].entity);
            expect(notificationFromDB.isRead).toEqual(notifications[i].isRead);
            expect(notificationFromDB.created_at).toEqual(notifications[i].created_at);
        });
    });

    /**
     * Ensure a notification can be obtained by id
     */

    it('gets a notification by id', async () => {
        const notificationFromDB = await Notification.findById('000000000000000000000041');

        expect(notificationFromDB).toBeTruthy();
        expect(notificationFromDB._id).toEqual(notifications[0]._id);
        expect(notificationFromDB.type).toEqual(notifications[0].type);
        expect(notificationFromDB.recipient).toEqual(notifications[0].recipient);
        expect(notificationFromDB.patient).toEqual(notifications[0].patient);
        expect(notificationFromDB.entity).toEqual(notifications[0].entity);
        expect(notificationFromDB.isRead).toEqual(notifications[0].isRead);
        expect(notificationFromDB.created_at).toEqual(notifications[0].created_at);

    });

    /**
     * Ensure that we retrieve no data when requesting for an invalid id
     */
    it('returns null when requesting for an invalid id', async () => {

        const notificationFromDB = await Notification.findById('000000000000000000000040');
        expect(notificationFromDB).toBeNull();
    });

});

describe('Populate', () => {
    /**
     * Ensure patient's responsible clinician is populated correctly
     */
    it('populates patient\'s responsible clinician', async () => {
        const patientFromDB = await Patient.findById('000000000000000000000001').populate('responsibleClinicians');
        expect(patientFromDB).toBeTruthy();
        expect(patientFromDB.responsibleClinicians._id).toEqual(users[0]._id);
    });

    /**
     * Ensure patient's notification is populated correctly
     */
    it('populates patient\'s notification', async () => {
        const patientFromDB = await Patient.findById('000000000000000000000001').populate('notification');
        expect(patientFromDB).toBeTruthy();
        expect(patientFromDB.notification[0]._id).toEqual(notifications[0]._id);
    });

    /**
     * Ensure user's notification is populated correctly
     */
    it('populates user\'s notification', async () => {
        const userFromDB = await User.findById('000000000000000000000011').populate('notification');
        expect(userFromDB).toBeTruthy();
        expect(userFromDB.notification[0]._id).toEqual(notifications[0]._id);
    });

    /**
     * Ensure user's team is populated correctly
     */
    it('populates user\'s team', async () => {
        const userFromDB = await User.findById('000000000000000000000011').populate('team');
        expect(userFromDB).toBeTruthy();
        expect(userFromDB.team._id).toEqual(teams[0]._id);
    });

    /**
     * Ensure tasks's patient is populated correctly
     */
    it('populates task\'s patient', async () => {
        const taskFromDB = await Task.findById('000000000000000000000021').populate('patient');
        expect(taskFromDB).toBeTruthy();
        expect(taskFromDB.patient._id).toEqual(patients[0]._id);
    });



});

describe('test patient-dao functions', () => {

    /**
     * fn: retrievePatient(id)
     * Ensure a patient can be obtained by id
     */
    it('gets a patient 000000000000000000000001', async () => {
        expect((await retrievePatient('000000000000000000000001'))._id).toEqual(patients[0]._id);
        expect((await retrievePatient('000000000000000000000001')).fname).toEqual(patients[0].fname);
        expect((await retrievePatient('000000000000000000000001')).lname).toEqual(patients[0].lname);
    });

    /**
     * fn: updatePatient(id, data)
     * Ensure a patient can be updated by id
     */
    it('updates a patient by id', async () => {
        const data = {
            fname: 'Laureen1'
        }
        expect(await updatePatient('000000000000000000000001', data)).toBeTruthy();

    });

    /**
     * fn: deletePatient(id)
     * Ensure a patient can be deleted by id
     */
    it('deletes a patient by id', async () => {
        expect(await deletePatient('000000000000000000000001')).toBeTruthy();
    });

});


