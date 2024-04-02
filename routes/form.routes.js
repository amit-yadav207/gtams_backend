import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import { getFormResponseByJobId } from "../controllers/form.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);

router.post('/:jobId', isLoggedIn, authorizeRoles('USER'),getFormResponseByJobId );

export default router;
