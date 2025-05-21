import express from "express";
import cors from "cors";
import questionRoutes from "./routes/questionRoutes";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/db";
import quizRoutes from "./routes/quizRoutes";
const app = express();
// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", questionRoutes);

app.use("/api", userRoutes);
app.use("/api", quizRoutes);
export default app;
