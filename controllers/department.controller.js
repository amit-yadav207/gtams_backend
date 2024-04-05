import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/appError.js';
import Department from '../models/department.model.js'


export const createDepartment = asyncHandler(async (req, res, next) => {
    const formData = req.body;
    const department = await Department.create(formData);

    if (!department) {
        return next(new AppError('Department not created', 404));
    }

    res.status(201).json({
        success: true,
        message: 'Department created',
        department
    })
});


export const deleteDepartment = asyncHandler(async (req, res, next) => {
    const id = req.body;

    const result = await Department.findByIdAndDelete({ _id: id });

    if (result.deletedCount === 0) {
        return next(new AppError('Department not created.', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Department deleted successfully.',
        result
    });
});
