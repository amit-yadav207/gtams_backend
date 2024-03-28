import { Router } from "express";
import {
    createApplication,
    updateApplication,
    deleteApplication,
    applyToApplication,
    getAllJobs
} from "../controllers/application.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);
router.patch('/update/:id', isLoggedIn, authorizeRoles('DS'), updateApplication);
router.delete('/delete/:id', isLoggedIn, authorizeRoles('DS'), deleteApplication);
router.post('/apply/:id', isLoggedIn, applyToApplication);
router.post('/getAllJobs', isLoggedIn, getAllJobs);

export default router;
