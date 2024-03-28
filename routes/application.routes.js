import { Router } from "express";
import {
    createApplication,
    updateApplication,
    deleteApplication,
    applyToApplication
} from "../controllers/application.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/create', isLoggedIn, authorizeRoles('TACM'), createApplication);
router.patch('/update/:id', isLoggedIn, authorizeRoles('TACM'), updateApplication);
router.delete('/delete/:id', isLoggedIn, authorizeRoles('TACM'), deleteApplication);
router.post('/apply/:id', isLoggedIn, applyToApplication);

export default router;
