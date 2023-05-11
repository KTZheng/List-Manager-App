import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import router from '../api';
import express from 'express';
import request from 'supertest';

import { Patient, User, Task, Team, Notification } from '../../patientlist-db/schema';


let mongod;

const app = express();
app.use(express.json());
app.use('/api', router);

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
        type: 'Admin',
        recipient: [new mongoose.Types.ObjectId('000000000000000000000011'), new mongoose.Types.ObjectId('000000000000000000000012')],
        patient: new mongoose.Types.ObjectId('000000000000000000000001'),
        entity: 'You have a new patient',
        isRead: false,
        created_at: new Date('2023-05-06T00:00:00.000Z'),
    },
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000042'),
        type: 'Task',
        recipient: [new mongoose.Types.ObjectId('000000000000000000000012'), new mongoose.Types.ObjectId('000000000000000000000011')],
        patient: new mongoose.Types.ObjectId('000000000000000000000002'),
        entity: 'Blood test needed for',
        isRead: true,
        created_at: new Date('2023-05-07T00:00:00.000Z'),
    }
];



/*
 * Before all, init MongoMemoryServer
 */
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const conncetionString = mongod.getUri();
    await mongoose.connect(conncetionString);
})

/*
 * Before each, wipe-out the database, and create the test data
 */


beforeEach(async () => {

    // Clear database and data
    await mongoose.connection.db.dropDatabase();
    await Patient.insertMany(patients);
    await User.insertMany(users);
    await Notification.insertMany(notifications);

    
});


/*
 * After all, stop in-memory DB
 */
afterAll(async ()=> {

    await mongoose.disconnect();
    await mongod.stop();

})

it('gets all notification from API', (done) => {
    request(app)
        .get(`/api/notification`)
        .send()
        .expect(200)
        .end((err, res) => {
    
            if (err) return done(err);

            const notificationDB = res.body;
               expect(notificationDB.length).toBe(2)
            expect(notificationDB[0]._id).toBe('000000000000000000000041')
            expect(notificationDB[1]._id).toBe('000000000000000000000042')
            expect(notificationDB[0].recipient.length).toBe(2)
            expect(notificationDB[1].recipient.length).toBe(2)
            expect(notificationDB[0].recipient[0]).toEqual(notifications[0].recipient[0].toString())
            expect(notificationDB[1].recipient[1]).toEqual(notifications[1].recipient[1].toString())
            expect(notificationDB[0].patient).toEqual(notifications[0].patient.toString())
            expect(notificationDB[1].patient).toEqual(notifications[1].patient.toString())
            expect(notificationDB[0].type).toBe('Admin')
            expect(notificationDB[1].type).toBe('Task')
            expect(notificationDB[0].isRead).toBeFalsy()
            expect(notificationDB[1].type).toBeTruthy()

            return done();
        });
})

it('gets notification from API without authentication', (done) => {
     request(app)
        .get(`/api/notification/000000000000000000000041`)
        .send()
        .expect(500)
        .end((err, res) => {
    
            if (err) return done(err);
            return done();
        });
})
