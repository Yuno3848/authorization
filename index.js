import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;
const handleCors = {
  origin: process.env.BASE_URL,
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
