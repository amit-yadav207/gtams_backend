import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
    createDepartment,
    deleteDepartment
} from "../controllers/department.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);


router.post('/create', isLoggedIn, authorizeRoles('ADMIN'), createDepartment);
router.post('/delete', isLoggedIn, authorizeRoles('ADMIN'), deleteDepartment);



export default router;
