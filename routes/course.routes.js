import { Router } from 'express';
import {
  getAllCourses,
  createCourse,
  deleteCourseById,
} from '../controllers/course.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();


router.route('/getAllCourses').post(getAllCourses);

// router.route('/create').post(isLoggedIn, authorizeRoles('ADMIN'), createCourse);
router.route('/create').post(isLoggedIn, createCourse);

// router.route('/delete').post(isLoggedIn, authorizeRoles('ADMIN'), deleteCourseById);
router.route('/delete').post(isLoggedIn, deleteCourseById);



export default router;
