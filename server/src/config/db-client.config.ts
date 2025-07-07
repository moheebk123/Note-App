import mongoose from "mongoose";

const localDbUrl = ["mongodb://localhost:27017", "mongodb://127.0.0.1"];

export const connectDB = async () => {
  const dbUri = String(process.env.MONGODB_URI);
  const dbName = String(process.env.MONGODB_DB_NAME);

  const dbUrl = localDbUrl.includes(dbUri) ? `${dbUri}/${dbName}` : dbUri;
  try {
    await mongoose.connect(dbUrl);
    mongoose.set("debug", true);
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
