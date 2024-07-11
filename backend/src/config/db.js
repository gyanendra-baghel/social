import mongoose from "mongoose";
import config from "./index.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.mongoDbUri);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
