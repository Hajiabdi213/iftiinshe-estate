import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connection = await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to the MongoDB"));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
