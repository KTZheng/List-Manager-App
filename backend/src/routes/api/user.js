import express from "express";
import passport from "../../middleware/passport.js";
import { retrieveAllSupervisors } from "../../dao/user-dao";

const router = express.Router();

// Create a route for user login and authentication.
router.post("/login", (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error.", redirect: "/login" });
    }
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password.", redirect: "/login" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed.", redirect: "/login" });
      }
      req.session.user = user;
      req.session.loggedIn = true;
      
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving session." });
        }
        return res.status(200).json({ message: "Login successful.", user: user.toObject(), redirect: "/patientlist" });

      });
    });
  })(req, res, next);
});

// Create a route for user logout. When logout, destroys the session and clear session cookie.
router.post('/logout', async (req, res) => {

  req.logout(() => {
    req.session.destroy(async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error destroying session' });
      }

      // delete session from MongoDB
      const sessionStore = req.sessionStore;
      await sessionStore.destroy(req.sessionID);

      // Clear session cookie from the client-side
      res.clearCookie('connect.sid', { path: '/' });
      return res.status(200).json({ message: 'logout successful', redirect: '/login' });
    });
  });
});

router.get('/retrieveAllSupervisors', async (req, res) => {
  const result = await retrieveAllSupervisors();

  if (result) {
      res.json(result);
  } else {
      res.status(404).send('Not found');
  }
});


export default router;
