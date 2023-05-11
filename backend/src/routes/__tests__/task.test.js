import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Task } from '../../patientlist-db/schema';
import express from 'express';
import request from 'supertest';
import router from '../api/task';

let mongod;

const app = express();
app.use('/', router);

const task1 =
{
    _id: new mongoose.Types.ObjectId('000000000000000000000001'),
    name: 'Blood Pressure',
    type: 'Blood Test',
    patient: new mongoose.Types.ObjectId('000000000000000000000012'),
    clinician: new mongoose.Types.ObjectId('000000000000000000000012'),
    priority: 3,
    notification: [new mongoose.Types.ObjectId('000000000000000000000042')],
    finished_at: new Date('2023-05-07T00:00:00.000Z'),
    created_at: new Date('2023-05-07T00:00:00.000Z'),
    status: 1,
    result: 'Abnormal',
};
const task2 =
{
    _id: new mongoose.Types.ObjectId('000000000000000000000002'),
    name: 'Check Cholesterol',
    type: 'Blood Test',
    patient: new mongoose.Types.ObjectId('000000000000000000000012'),
    clinician: new mongoose.Types.ObjectId('000000000000000000000012'),
    priority: 1,
    notification: [new mongoose.Types.ObjectId('000000000000000000000042')],
    finished_at: new Date('2023-05-07T00:00:00.000Z'),
    created_at: new Date('2023-05-07T00:00:00.000Z'),
    status: 0,
    result: 'Abnormal',
};
const task3 =
{
    _id: new mongoose.Types.ObjectId('000000000000000000000003'),
    name: 'Review MRI',
    type: 'Blood Test',
    patient: new mongoose.Types.ObjectId('000000000000000000000012'),
    clinician: new mongoose.Types.ObjectId('000000000000000000000012'),
    priority: 3,
    notification: [new mongoose.Types.ObjectId('000000000000000000000042')],
    finished_at: new Date('2023-05-07T00:00:00.000Z'),
    created_at: new Date('2023-05-07T00:00:00.000Z'),
    status: 1,
    result: 'Normal',
};
const task4 =
{
    _id: new mongoose.Types.ObjectId('000000000000000000000004'),
    name: 'CT scan',
    type: 'Radiology',
    patient: new mongoose.Types.ObjectId('000000000000000000000012'),
    clinician: new mongoose.Types.ObjectId('000000000000000000000012'),
    priority: 2,
    notification: [new mongoose.Types.ObjectId('000000000000000000000042')],
    finished_at: new Date('2023-05-07T00:00:00.000Z'),
    created_at: new Date('2023-05-07T00:00:00.000Z'),
    status: 0,
    result: 'Normal',
};

const tasks = [task1, task2, task3, task4]


beforeAll(async () => {

    mongod = await MongoMemoryServer.create();

    const connectionString = mongod.getUri();
    await mongoose.connect(connectionString, { useNewUrlParser: true });
});

beforeEach(async () => {

    // Drop existing db
    await mongoose.connection.db.dropDatabase();
    await Task.insertMany(tasks);

});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

it('Getting one task by id works', (done) => {
    request(app)
        .get('/000000000000000000000001')
        .send()
        .expect(200)
        .end((err, res) => {

            if (err) return done(err);
            const fromApi = res.body
            expect(fromApi.name).toBe('Blood Pressure')
            return done()
        })
})


