import { Router } from "express";

import { newsController } from "../../controllers/newsController.js";
import { newsService } from "../../services/newsService.js";

const router = Router();

router.use("/", newsController(newsService));

export default router;
