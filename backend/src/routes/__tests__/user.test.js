import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import router from '../api';
import express from 'express';
import request from 'supertest';
import { User } from '../../patientlist-db/schema';
import passport from 'passport';
import session from 'express-session';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

// Configure express-session
app.use(
  session({
    secret: 'secret_keyjdwifwfqhqif',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js and enable session support
app.use(passport.initialize());
app.use(passport.session());

let mongod;


app.use('/api', router);

const users = [
    {
        _id: new mongoose.Types.ObjectId('000000000000000000000011'),
        fname: 'Zhiyan',
        lname: 'Test',
        phone: 1234567890,
        email: 'testEmail1@test.com',
        password: bcrypt.hashSync('testPassword1', 10),
        isSupervisor: false,
        isAdmin: false,
        role: 'testRole1',
        avatar: 'testAvatar1',
        notification: [new mongoose.Types.ObjectId('000000000000000000000041')],
        created_at: new Date('2023-05-06T00:00:00.000Z'),
        team: new mongoose.Types.ObjectId('000000000000000000000031'),
    },
];

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const connectionString = mongod.getUri();
    await mongoose.connect(connectionString, { useNewUrlParser: true });
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);

    await User.insertMany(users);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

it('login', (done) => {
    request(app)
        .post('/api/user/login')
        .send({
            email: 'testEmail1@test.com',
            password: 'testPassword1',
        })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);

            const user = res.body.user;
            expect(user.fname).toEqual('Zhiyan');
            expect(user.lname).toEqual('Test');
            expect(user.email).toEqual('testEmail1@test.com');

            return done();
        });
}, 10000);

it('logout', (done) => {
    request(app)
        .post('/api/user/login')
        .send({
            email: 'testEmail1@test.com',
            password: 'testPassword1',
        })
        .end((err, res) => {
            if (err) return done(err);

            request(app)
                .post('/api/user/logout')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body.message).toEqual('logout successful');
                    expect(res.body.redirect).toEqual('/login');

                    return done();
                });
        });
}, 10000);

it('update user profile', (done) => {
    request(app)
      .post('/api/user/login')
      .send({
        email: 'testEmail1@test.com',
        password: 'testPassword1',
      })
      .end((err, res) => {
        if (err) return done(err);
  
        const cookie = res.header['set-cookie'];
        const updatedData = {
          fname: 'Updated',
          lname: 'User',
          phone: 9876543210,
          role: 'updatedRole',
          avatar: 'updatedAvatar',
        };
  
        request(app)
          .put(`/api/user_profile/${users[0]._id}`)
          .set('cookie', cookie)
          .send(updatedData)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
  
            const updatedUser = res.body;
            expect(updatedUser.fname).toEqual(updatedData.fname);
            expect(updatedUser.lname).toEqual(updatedData.lname);
            expect(updatedUser.phone).toEqual(updatedData.phone);
            expect(updatedUser.role).toEqual(updatedData.role);
            expect(updatedUser.avatar).toEqual(updatedData.avatar);
  
            done();
          });
      });
  });
  
  it('update user password', (done) => {
    request(app)
      .post('/api/user/login')
      .send({
        email: 'testEmail1@test.com',
        password: 'testPassword1',
      })
      .end((err, res) => {
        if (err) {
          console.error('Error logging in:', err);
          return done(err);
        }
  
        const cookie = res.header['set-cookie'];
        const newPassword = 'newPassword';
  
        request(app)
          .put(`/api/user_profile/password/${users[0]._id}`)
          .set('cookie', cookie)
          .send({ newPassword })
          .expect(204)
          .end((err, res) => {
            if (err) {
              console.error('Error updating password:', err);
              return done(err);
            }
  
            console.log('Update password response:', res.body);
  
            // Check if new password matches
            request(app)
              .post('/api/user/login')
              .send({
                email: 'testEmail1@test.com',
                password: newPassword,
              })
              .expect(200)
              .end((err, res) => {
                if (err) {
                  console.error('Error logging in with new password:', err);
                  return done(err);
                }
  
                const user = res.body.user;
                expect(user.email).toEqual('testEmail1@test.com');
  
                done();
              });
          });
      });
  });
  
  
  