import mongoose from "mongoose";

export const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  const dbUrl = `${dbUri}/${dbName}`;
  try {
    await mongoose.connect(dbUrl);
    mongoose.set("debug", true);
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
