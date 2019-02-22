import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Promise from "bluebird";
import errorHandler from "./middlewares/errorHandler";
import apiResponse from "./middlewares/apiResponse";

import auth from "./routes/auth";
import users from "./routes/users";

dotenv.config();
const app = express();

app.use(apiResponse);

app.use(bodyParser.json());

// overwrite the built in mongo promise library with bluebird promise library.
mongoose.Promise = Promise;

// found out that the following is deprecated
// mongoose.connect(process.env.MONGODB_URL,  { useMongoClient: true });

// Use the following url parser
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

app.use("/api/auth", auth);

app.use("/api/users", users);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(errorHandler);

app.listen(8080, () => console.log("running on localhost:8080"));

export default app;
