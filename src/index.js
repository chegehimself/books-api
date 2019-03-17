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
import books from "./routes/books";
import createDbConnection from "./utils/dbConnection";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8082;
app.use(apiResponse);

app.use(bodyParser.json());

// overwrite the built in mongo promise library with bluebird promise library.
mongoose.Promise = Promise;

// found out that the following is deprecated
// mongoose.connect(process.env.MONGODB_URL,  { useMongoClient: true });
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

createDbConnection();

app.use("/api/auth", auth);

app.use("/api/users", users);

app.use("/api/books", books);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`running on localhost:${PORT}`));

export default app;
