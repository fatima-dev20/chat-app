import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";
import { getAllUsersWithUnseenMessages } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/update-profile", protectRoute, updateProfile);
userRouter.post("/check", protectRoute, checkAuth);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.get("/users", protectRoute, getAllUsersWithUnseenMessages);



export default userRouter;