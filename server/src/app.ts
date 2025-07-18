import dotenv from "dotenv"
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import "./types/express";
import { connectDB } from "./config/db-client.config.js";
import * as routes from "./routes/index.routes.js";
import {verifyAuthentication} from "./middlewares/verify.middleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(verifyAuthentication);

app.use("/note", routes?.noteRoutes);
app.use("/auth", routes?.authRoutes);
app.use("/oauth/google", routes?.oauthRoutes);

try {
  await connectDB();
  const port: number = Number(process.env.PORT) | 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error(error);
}
