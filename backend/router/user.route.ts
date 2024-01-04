import express from "express";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.get("/", UserController.getUsers);

router.get("/:id", UserController.getUser);

router.put("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteUser);

export default router;
