import { Router } from "express";

import newsRoutes from "./newsRoutes.js";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import themeRoutes from "./themeRoutes.js";
import commentRoutes from "./commentRoutes.js";
import messageRoutes from "./messageRoutes.js";

const routes = Router();

routes.use("/news", newsRoutes);
routes.use("/auth", authRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/themes", themeRoutes);
routes.use("/comments", commentRoutes);
routes.use("/messages", messageRoutes);

export default routes;
