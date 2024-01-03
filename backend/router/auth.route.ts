import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh", AuthController.refreshToken);

export default router;
