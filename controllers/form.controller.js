import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import Application from "../models/application.model.js";
import { sendEmail } from '../utils/sendEmail.js';
import Form from "../models/form.model.js";
import User from "../models/user.model.js";


// export const createApplication = asyncHandler(async (req, res, next) => {

// })


export const getFormResponseByJobId = asyncHandler(async (req, res, next) => {
    const { jobId } = req.pram;
    const id = req.user.id;

    const user = await User.findById(id);


    if (!user) {
        return next(new AppError("User not found.", 404));
    }

    const formId = await Application.findOne({ jobId, 'appliedBy.user': user._id }).select('appliedBy.form');

    const form = await Form.findById(formId);

    if (!form) {
        return next(new AppError("Response not found.", 404));
    }

    res.status(200).json({
        success: true,
        message: 'Response fetched.',
        form
    });
})


// export const createApplication = asyncHandler(async (req, res, next) => {

// })
