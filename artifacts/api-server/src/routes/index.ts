import { Router, type IRouter } from "express";
import healthRouter from "./health";
import booksRouter from "./books";
import influencersRouter from "./influencers";
import usersRouter from "./users";
import adminRouter from "./admin";
import ordersRouter from "./orders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(booksRouter);
router.use(influencersRouter);
router.use(usersRouter);
router.use(adminRouter);
router.use(ordersRouter);

export default router;
