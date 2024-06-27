import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path"; // Add this if path is being used
import http from "http"; // Import the http module
import { Server } from "socket.io";
import router from "./routes/testRoute.js";
import productRouter from "./routes/productsRouter.js";
import userRouter from "./routes/userRouter.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import passport from "passport";
import passportStrategy from "./config/passportConfig.js";

dotenv.config();
const app = express();
// const server = http.createServer(app);
// export const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

const addMiddlewares = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  cloudinaryConfig();
  app.use(passport.initialize());
  passport.use(passportStrategy);
};

const startServer = () => {
  const port = process.env.PORT || 3020;
  app.listen(port, () => {
    console.log("Server is running on " + port + "port");
  });
};

const loadRoutes = () => {
  app.use("/api", router); //base url
  app.use("/api/products", productRouter);
  app.use("/api/users", userRouter);
  app.use("*", (req, res) => {
    res.status(404).json({ error: 'Endpoint doesn"t exist' });
  });
  app.get("*", function (요청, 응답) {
    응답.sendFile(path.join(__dirname, "/react-project/build/index.html"));
  });
};

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
  } catch (error) {
    console.log(error);
  }
};

const startApp = async () => {
  await DBconnection();
  addMiddlewares();
  loadRoutes();
  startServer();
};

startApp();
