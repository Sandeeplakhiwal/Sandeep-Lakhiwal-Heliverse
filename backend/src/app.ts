import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error.middleware";

const app = express();

// Configured dotenv path for environment variables
dotenv.config({
  path: "./src/config/.env",
});

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Sandeep Lakhiwal");
});

// Importing Routes
import otherRoute from "./routes/other.route";

// Using Routes
app.use("/api", otherRoute);

// Usign error middleware for exception handling
app.use(ErrorMiddleware);

export default app;
