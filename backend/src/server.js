import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import mongoose from "mongoose";
import * as url from "url";
import cors from "cors";

import passport from "./middleware/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";


// Setup Express
const app = express();
const port = process.env.PORT ?? 3000;

// app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Setup body-parser
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

export const store = new MongoStore({
  mongoUrl: process.env.DB_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: "secret_keyjdwifwfqhqif",
    resave: false,
    store: store,
    saveUninitialized: false,
    unset: "destroy",
    cookie: { maxAge: 1000 * 60 * 30 },
  })
);

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

// Setup our routes.
import routes from "./routes/index.js";
app.use("/", routes);

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Make the "public" folder available statically
app.use(express.static(path.join(dirname, "../public")));

// Serve up the frontend's "dist" directory, if we're running in production mode.
if (process.env.NODE_ENV === "production") {
  console.log("Running in production!");

  // Make all files in that folder public
  app.use(express.static(path.join(dirname, "../../frontend/dist")));

  // If we get any GET request we can't process using one of the server routes, serve up index.html by default.
  app.get("*", (req, res) => {
    res.sendFile(path.join(dirname, "../../frontend/dist/index.html"));
  });
}


app.listen(port, () => console.log(`App server listening on port ${port}!`));
