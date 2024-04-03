import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import { getUserFormResponseByJobId, getAllFormResponseByJobId } from "../controllers/form.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);

router.post('/:jobId', isLoggedIn, authorizeRoles('USER'), getUserFormResponseByJobId);
router.post('/getAllFormResponseByJobId/:jobId', isLoggedIn, getAllFormResponseByJobId);

export default router;
