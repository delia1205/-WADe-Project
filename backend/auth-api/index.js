import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((err) => {
    console.log("[ERROR]: ", err);
  });

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API for user authentication and management",
    },
  },
  apis: ["auth-api/routes/*.js"],
};

const specs = swaggerJSDoc(options);
console.log(JSON.stringify(specs, null, 2));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(3002, () => {
  console.log("Server is running on port 3002.");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
