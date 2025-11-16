import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth.js";

const router = express.Router();

// Mount Better Auth handler
router.all("/*", toNodeHandler(auth));

export default router;

