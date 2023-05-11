import passport from "passport";
import LocalStrategy from "passport-local";
import { getUserByEmail, getUserById } from "../dao/user-dao.js";
import bcrypt from "bcrypt";

// check if password is valid
async function isPasswordValid(user, password) {
  return user.isPlainTextPassword
    ? password === user.password
    : await bcrypt.compare(password, user.password);
}

// Use local strategy to configure passport
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email);

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        if (!(await isPasswordValid(user, password))) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// store user id in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// retrieve user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
