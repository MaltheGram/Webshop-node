import mongoose from "mongoose";
const db_string =
  "mongodb+srv://malthegram22:1b0E9yVRAxadkMeJ@cluster0.onnrmnv.mongodb.net/?retryWrites=true&w=majority";

const connectDatabase = async () => {
  try {
    await mongoose.connect(db_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error({ Error: "MongoDB Error:", err });
    process.exit(1);
  }
};

export default connectDatabase;
