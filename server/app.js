import dotenv from "dotenv"
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db-client.config.js";
import * as routes from "./routes/index.routes.js";
import { verifyAuthentication } from "./middlewares/verify.middleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(verifyAuthentication);

app.use("/note", routes.noteRoutes);
app.use("/user", routes.userRoutes);
app.use("/auth", routes.authRoutes);
app.use(routes.oauthRoutes);

app.use((_, res) => {
  return res.status(404).json({ message: "Invalid request" });
});

try {
  await connectDB();
  app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
  });
} catch (error) {
  console.error(error);
}
