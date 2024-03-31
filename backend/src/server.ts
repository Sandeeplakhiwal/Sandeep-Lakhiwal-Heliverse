import app from "./app";
import { connectDB } from "./config/db";
import cloudinary from "cloudinary";

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Error", err.message);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

// Connecting to database
connectDB();

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
