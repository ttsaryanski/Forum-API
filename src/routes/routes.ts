import { Router } from "express";

import newsRoutes from "./news/newsController.js";

const routes = Router();

routes.use("/news", newsRoutes);

export default routes;
