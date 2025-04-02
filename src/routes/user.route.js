import { Router } from "express";
import { getAllUsers, getMessages } from "../controllers/user.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);

export default router;