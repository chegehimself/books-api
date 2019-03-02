import mongoose from "mongoose";

const mongooseConnection = db =>
  mongoose.connect(db, { useNewUrlParser: true });

const createDbConnection = () => {
  if (process.env.NODE_ENV === "development") {
    mongooseConnection(process.env.MONGODB_URL);
  } else if (process.env.NODE_ENV === "test") {
    mongooseConnection(process.env.TEST_DB);
  } else if (process.env.NODE_ENV === "production") {
    mongooseConnection(process.env.PRODUCTION);
  }
};
export default createDbConnection;
