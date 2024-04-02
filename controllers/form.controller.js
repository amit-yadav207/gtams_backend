import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import Application from "../models/application.model.js";
import { sendEmail } from '../utils/sendEmail.js';
import Form from "../models/form.model.js";
import User from "../models/user.model.js";


// export const createApplication = asyncHandler(async (req, res, next) => {

// })

export const getFormResponseByJobId = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError("User not found.", 404));
    }

    try {
        const form = await Application.aggregate([
            {
                $match: { jobId, 'appliedBy.user': user._id }
            },
            {
                $unwind: '$appliedBy'
            },
            {
                $match: { 'appliedBy.user': user._id }
            },
            {
                $project: {
                    form: '$appliedBy.form'
                }
            }
        ]);

        if (!form || form.length === 0 || !form[0].form) {
            return next(new AppError("Response not found.", 404));
        }

        const formId = form[0].form;

        const responseForm = await Form.findById(formId);

        if (!responseForm) {
            return next(new AppError("Response form not found.", 404));
        }

        res.status(200).json({
            success: true,
            message: 'Response fetched.',
            form: responseForm
        });
    } catch (error) {
        console.error(error);
        return next(new AppError("Error fetching response.", 500));
    }
});


// export const createApplication = asyncHandler(async (req, res, next) => {

// })
