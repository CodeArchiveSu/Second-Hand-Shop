import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import router from "./routes/testRoute.js";
import productRouter from "./routes/productsRouter.js";
import userRouter from "./routes/userRouter.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import passport from "passport";
import passportStrategy from "./config/passportConfig.js";
import favoriteItemesRouter from "./routes/favoriteItemsRoute.js";
import chatRouter from "./routes/chatRoute.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "path"; // Add this if path is being used
import http from "http"; // Import the http module
import session from "express-session";

dotenv.config();
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    mathods: ["GET", "POST"],
  },
});

const sessionMiddleware = session({
  secret: "비밀코드",
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: false,
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
  next();
});

io.on("connection", (socket) => {
  console.log("컨넥트잘됨");

  socket.on("ask-join", (data) => {
    console.log("join socket:::", data);
    socket.join(data);
  });

  socket.on("message-send", (data) => {
    console.log("Message received on server:", data);
    io.to(data.room).emit("message-broadcast", {
      chatUserId: data.chatUserId,
      chatUserName: data.chatUserName,
      createdAt: data.createdAt,
      message: data.message,
      room: data.room,
      _id: data._id,
    });
  });
}); // 연결확인

const addMiddlewares = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(sessionMiddleware);
  cloudinaryConfig();
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(passportStrategy);
};

const startServer = () => {
  const port = process.env.PORT || 3020;
  server.listen(port, () => {
    console.log("Server is running on " + port + "port");
  });
};

const loadRoutes = () => {
  app.use("/api", router); //base url
  app.use("/api/products", productRouter);
  app.use("/api/users", userRouter);
  app.use("/api/favoriteItems", favoriteItemesRouter);
  app.use("/api/chatRooms", chatRouter);
  app.use("*", (req, res) => {
    res.status(404).json({ error: 'Endpoint doesn"t exist' });
  });
  app.get("*", function (요청, 응답) {
    응답.sendFile(path.join(__dirname, "/react-project/build/index.html"));
  });
  app.post("/incr", (req, res) => {
    const session = req.session;
    session.count = (session.count || 0) + 1;
    res.status(200).end("" + session.count);
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
