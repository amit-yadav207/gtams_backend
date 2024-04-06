import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
    createDepartment,
    deleteDepartment,
    getAllDepartment
} from "../controllers/department.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);


router.post('/create', isLoggedIn, authorizeRoles('ADMIN'), createDepartment);
router.post('/delete', isLoggedIn, authorizeRoles('ADMIN'), deleteDepartment);
// router.post('/getAllDepartment', isLoggedIn, authorizeRoles('ADMIN'), getAllDepartment);
router.post('/getAllDepartment', isLoggedIn, getAllDepartment);



export default router;
