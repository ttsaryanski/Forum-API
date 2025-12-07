import { Router } from "express";

import { categoryController } from "../controllers/categoryController.js";
import { categoryService } from "../services/categoryService.js";

const router = Router();

router.use("/", categoryController(categoryService));

export default router;
