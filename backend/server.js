// import dotenv from "dotenv";
// dotenv.config(); 
// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import http from "http";
// import {connectDB} from "./lib/db.js";
// import userRouter from "./routes/userRoutes.js";
// import messageRouter from "./routes/messageRoutes.js";
// import { Server } from "socket.io";

// console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

// // Create Express app and HTTP server
// const app = express();
// const server = http.createServer(app)

// // Initialize socket.io server
// export const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://chat-app-20.vercel.app/"
//     ],
//     methods: ["GET", "POST"],
//   }
// });


// // Store online users
// export const userSocketMap = {}; // {userId: socketId}

// // Socket.io connection handler
// io.on("connection", (socket)=>{
//   const userId = socket.handshake.query.userId;
//   console.log("User Connected", userId);

//   if(userId) userSocketMap[userId] = socket.id;

//   // Emit online users to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", ()=>{
//     console.log("User Disconnected", userId);
//     delete  userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap))
//   })
// })

// // Middleware setup; 
// app.use(express.json({limit: "4mb"}));
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://chat-app-20.vercel.app/"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "token"],
//   })
// );

// // handle preflight requests
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:3000",
//     "https://chat-app-20.vercel.app/"
//   ],
//   credentials: true
// }));




// // Route setup
// app.use("/api/status", (req, res)=>res.send("Server is live") );
// app.use("/api/auth", userRouter);
// app.use("/api/messages", messageRouter)

// // Connect to mongoDB
// await connectDB();


//   const PORT = process.env.PORT || 5000;
// server.listen(PORT, ()=> console.log("Server is running on port : "+ PORT));


// // Export server got versel
// export default server;





import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chat-app-20.vercel.app"
];

// Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);

    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"]
}));

// Routes
app.get("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Database connection and server start
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

export default server;
