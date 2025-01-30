import express from "express";
import {
  test,
  update,
  deleteUser,
  signout,
  getUsers,
  getUserById,
  updatePassword,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:id", verifyToken, update);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/signout", signout);
router.get("/get-users", verifyToken, getUsers);
router.get("/:userId", getUserById);
router.put("/update-password/:id", verifyToken, updatePassword);

export default router;
