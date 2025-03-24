import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.PORT; //3000 || 4000;
const handleCors = {
  origin: process.env.BASE_URL, //http://localhost:8080
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(handleCors));

app.use("/api/v1/user", userRoutes);
db();
app.listen(port, () => {
  console.log(`listening port at ${port}`);
});
