import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
    getUserFormResponseByJobId,
    getAllFormResponseByJobId,
    changeFormStatusByFormId,
    rejectFromByFormId
} from "../controllers/form.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);

router.post('/getUserFormResponseByJobId/:jobId', isLoggedIn, authorizeRoles('USER'), getUserFormResponseByJobId);
router.post('/getAllFormResponseByJobId/:jobId', isLoggedIn, authorizeRoles('DS'), getAllFormResponseByJobId);
router.post('/changeFormStatusByFormId', isLoggedIn, authorizeRoles('DS'), changeFormStatusByFormId);
router.post('/rejectFromByFormId', isLoggedIn, rejectFromByFormId);


export default router;
