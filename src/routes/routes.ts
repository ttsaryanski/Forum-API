import { Router } from "express";

import newsRoutes from "./newsRoutes.js";
import authRoutes from "./authRoutes.js";

const routes = Router();

routes.use("/news", newsRoutes);
routes.use("/auth", authRoutes);

export default routes;
