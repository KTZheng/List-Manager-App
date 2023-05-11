import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import router from '../api';
import express from 'express';
import request from 'supertest';
import { Patient, User, Team } from '../../patientlist-db/schema'

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
]

const teams = [
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000031'),
        name: 'testTeam1',
        patients: [patients[0]._id],
        clinicians: [users[0]._id],
        supervisors: [users[0]._id]
    },
];

beforeAll(async () => {

    mongod = await MongoMemoryServer.create();
    const connectionString = mongod.getUri();
    await mongoose.connect(connectionString, { useNewUrlParser: true });
})

beforeEach(async() => {
    await mongoose.connection.db.dropDatabase();

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    
    await Patient.insertMany(patients);
    await User.insertMany(users);
    await Team.insertMany(teams);
})

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
})

it('get supervisor', (done) => {
    request(app)
        .get('/api/patient/supervisors/000000000000000000000011')
        .send()
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            
            const supervisor = res.body;
            expect(supervisor[0].id).toEqual('000000000000000000000011');
            expect(supervisor[0].fname).toEqual("Jingyi");
            expect(supervisor[0].lname).toEqual("You");

            return done();
        })

})

it('add new patients', (done) => {

    const newPatient = {
            fname: "Laureen",
            lname: "Lance",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id ipsum lectus. Donec commodo mollis suscipit. Donec ut purus nec nibh pharetra finibus. Nunc vitae suscipit urna. Vivamus efficitur turpis nibh, nec tristique purus tempus eu. Sed finibus sagittis tortor hendrerit suscipit. Vestibulum porta ex quis dui volutpat, ac mollis arcu ornare. Fusce sit amet efficitur odio, eu pharetra augue. Suspendisse ut ullamcorper lorem. Aenean at odio in dui tempor eleifend. Nullam a viverra enim. Aenean nec felis mattis, pharetra magna in, molestie lacus.",
            location: "Ward 1",
            responsibleClinicians: '000000000000000000000011',
            quickAdd: 'blood-test',
            birth_date: "1967-11-30T12:00:00.000+00:00",
            gender: "Female",
          }
    
    request(app)
        .post('/api/patient/add')
        .send(newPatient)
        .expect(200)
        .end(async (err, res)=> {
            if(err) return done(err);

            const allPatientsInDb = await Patient.find();
            
            const newPatientFromDb = allPatientsInDb[allPatientsInDb.length -1];
            expect(newPatientFromDb.fname).toEqual('Laureen');
            expect(newPatientFromDb.lname).toEqual('Lance');
            expect(newPatientFromDb.location).toEqual('Ward 1');
            expect(newPatient.responsibleClinicians).toEqual('000000000000000000000011');
            expect(newPatientFromDb.quickAdd).toEqual('blood-test');
            expect(newPatientFromDb.gender).toEqual('Female');
            return done();
        })

})