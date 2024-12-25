import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connection = await mongoose
      .connect(
        "mongodb+srv://abdillahi:tijaabo123@mern-real-estate-projec.nmrdn.mongodb.net/?retryWrites=true&w=majority&appName=mern-real-estate-project"
      )
      .then(() => console.log("Connected to the MongoDB"));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
