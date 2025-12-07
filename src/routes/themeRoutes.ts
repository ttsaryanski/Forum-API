import { Router } from "express";

import { themeController } from "../controllers/themeController.js";
import { themeService } from "../services/themeService.js";

const router = Router();

router.use("/", themeController(themeService));

export default router;
