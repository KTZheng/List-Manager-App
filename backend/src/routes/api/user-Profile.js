import express from 'express';
import {
    getUserById,
    updateUserProfile,
    updateUserPassword
} from '../../dao/user-dao'
import { authenticate } from '../../middleware/authMiddleware';

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

router.get('/:clinicianId', authenticate, async (req, res) => {
    const { clinicianId } = req.params;

    const user = await getUserById(clinicianId);

    if (user) {
        return res.json(user);
    }
    return res.sendStatus(HTTP_NOT_FOUND);

});

router.put('/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
    const userProfile = req.body;
    userProfile._id = userId;

    try {
        const success = await updateUserProfile(userProfile);
        if (success) {
            const updatedUser = await getUserById(userId);
            if (!res.headersSent) {
                req.session.user = updatedUser;
                req.session.save();
                return res.json(updatedUser);
            }
        } else {
            if (!res.headersSent) {
                return res.sendStatus(HTTP_NOT_FOUND);
            }
        }
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            return res.sendStatus(500);
        }
    }
});

router.put('/password/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    console.log('userId:', userId); // Add this line to log the userId.
    console.log('newPassword:', newPassword); // Add this line to log the newPassword.
  
    try {
      const success = await updateUserPassword(userId, newPassword);
      console.log('Update success:', success);
      if (success) {
        console.log('Password updated successfully');
        return res.sendStatus(HTTP_NO_CONTENT);
      } else {
        console.log('User not found or password update failed');
        return res.sendStatus(HTTP_NOT_FOUND);
      }
    } catch (err) {
      console.error('Error while updating password:', err);
      if (!res.headersSent) {
        return res.sendStatus(500);
      }
    }
  });
  

export default router;