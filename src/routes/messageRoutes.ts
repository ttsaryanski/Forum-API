import { Router } from "express";

import { messageController } from "../controllers/messageController.js";
import { messageService } from "../services/messageService.js";

const router = Router();

router.use("/", messageController(messageService));

export default router;
