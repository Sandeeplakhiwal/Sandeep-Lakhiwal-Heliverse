import app from "./app";
import { connectDB } from "./config/db";

// Connecting to database
connectDB();

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
