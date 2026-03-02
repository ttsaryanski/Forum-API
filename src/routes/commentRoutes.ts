import { Router } from "express";

import { commentController } from "../controllers/commentController.js";
import { commentService } from "../services/commentService.js";

const router = Router();

router.use("/", commentController(commentService));

export default router;
