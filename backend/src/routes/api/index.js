import express from 'express';

const router = express.Router();

import notification from './notification.js'
router.use('/notification', notification);

import team from './team'
router.use('/team', team);

import task from './task'
router.use('/task', task);

import user_profile from './user-Profile'
router.use('/user_profile', user_profile);

import user from './user'
router.use('/user', user);

import patient from './patient';
router.use('/patient', patient);

export default router;