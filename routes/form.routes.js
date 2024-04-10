import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
    getUserFormResponseByJobId,
    getAllFormResponseByJobId,
    changeFormStatusByFormId,
    rejectFromByFormId,
    acceptFromByFormId
} from "../controllers/form.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);

router.post('/getUserFormResponseByJobId/:jobId', isLoggedIn, authorizeRoles('USER'), getUserFormResponseByJobId);
router.post('/getAllFormResponseByJobId/:jobId', isLoggedIn, authorizeRoles('DS', 'TACM'), getAllFormResponseByJobId);
router.post('/changeFormStatusByFormId', isLoggedIn, authorizeRoles('DS'), changeFormStatusByFormId);
router.post('/changeFormStatusToAcceptedByFormId', isLoggedIn, authorizeRoles('DS'), changeFormStatusByFormId);
router.post('/rejectFromByFormId', isLoggedIn, rejectFromByFormId);
router.post('/accept', isLoggedIn, authorizeRoles('TACM'), acceptFromByFormId);


export default router;
