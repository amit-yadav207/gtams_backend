import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import Application from "../models/application.model.js";
import { sendEmail } from '../utils/sendEmail.js';
import Form from "../models/form.model.js";
import User from "../models/user.model.js";


// export const createApplication = asyncHandler(async (req, res, next) => {

// })

export const getUserFormResponseByJobId = asyncHandler(async (req, res, next) => {
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
                    form: '$appliedBy.form',
                    title: '$title',
                }
            }
        ]);

        if (!form || form.length === 0 || !form[0].form) {
            return next(new AppError("Response not found.", 404));
        }

        const formId = form[0].form;

        let responseForm = await Form.findById(formId);

        if (!responseForm) {
            return next(new AppError("Response form not found.", 404));
        }

        res.status(200).json({
            success: true,
            message: 'Response fetched.',
            form: responseForm,
            jobTitle: form[0].title
        });
    } catch (error) {
        console.error(error);
        return next(new AppError("Error fetching response.", 500));
    }
});



export const getAllFormResponseByJobId = asyncHandler(async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const application = await Application.findOne({ jobId });

        if (!application) {
            return next(new AppError('Application not found',409));
        }

        // get all the fromIds of response received on that requested application. 
        const formIds = application.appliedBy.map(item => item.form);

        // Find all forms with the extracted formIds
        const forms = await Form.find({ _id: { $in: formIds } });

        // Filter out null/undefined values
        const filteredForms = forms.filter(form => form);

        res.status(200).json({
            success: true,
            forms: filteredForms,
            message:'From data fetched successfully.'
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Error occured.', 505));
    }

})


// export const createApplication = asyncHandler(async (req, res, next) => {

// })
