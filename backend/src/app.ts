import express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config({
  path: "./src/config/.env",
});

console.log(process.env.PORT);

app.get("/", (req: Request, res: Response) => {
  res.send("Sandeep Lakhiwal");
});

export default app;
