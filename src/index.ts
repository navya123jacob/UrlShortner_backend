import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import router from "./routes/router";
import connectDb from "./config/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const CORS_ORIGIN_OFFICIAL = process.env.CORS_ORIGIN_official || 'http://localhost:5172';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [CORS_ORIGIN, CORS_ORIGIN_OFFICIAL],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "./public")));
app.use(cookieParser());
app.use(morgan("tiny"));

const startServer = async () => {
  await connectDb();

  app.use("/", router);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
