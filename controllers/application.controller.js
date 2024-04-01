import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import Application from "../models/application.model.js";
import { sendEmail } from '../utils/sendEmail.js';
import Form from "../models/form.model.js";
import User from "../models/user.model.js";

// export const createApplication = asyncHandler(async (req, res, next) => {

// })



export const createApplication = asyncHandler(async (req, res, next) => {
    try {
        const { title, courseId, instructor, requiredSkills, department, jobId, isApplicationOpen } = req.body;
        // const jobId = `${courseId}-${Date.now()}`;
        //assuming we are sending the jobId from frontend.

        const application = await Application.create({
            title,
            courseId,
            instructor,
            requiredSkills,
            department,
            createdBy: req.user.id,
            jobId,
            isApplicationOpen
        })

        if (!application) {
            return next(new AppError('Unable to create application.', 505));
        }

        return res.status(200).json({
            success: true,
            application, //should comment this in production
            message: "Application created successfully",
        })
    } catch (err) {
        console.error(err)
        return next(new AppError('Duplicate Job ID.', 505));
    }

})


export const updateApplication = asyncHandler(async (req, res, next) => {
    try {
        const { title, courseId, instructor, requiredSkills, department, jobId, isApplicationOpen } = req.body;
        const { id } = req.params;

        let application = await Application.findById(id);

        if (!application) {
            return next(new AppError('Application not found.', 404));
        }

        // Check if the user has permission to delete the application
        if (application.createdBy.toString() !== req.user.id) {
            return next(new AppError(`Only the person who created can update`, 401));
        }

        // Update the application fields
        application.title = title;
        application.courseId = courseId;
        application.instructor = instructor;
        application.requiredSkills = requiredSkills;
        application.department = department;
        application.jobId = jobId;
        application.isApplicationOpen = isApplicationOpen;

        application = await application.save();

        return res.status(200).json({
            success: true,
            application, // should remove this line in production
            message: "Application updated successfully",
        });
    } catch (err) {
        console.error(err);
    }

});



export const deleteApplication = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        let application = await Application.findById(id);

        if (!application) {
            return next(new AppError('Application not found.', 404));
        }

        // Check if the user has permission to delete the application
        if (application.createdBy.toString() !== req.user.id) {
            return next(new AppError(`Only the person who created can delete`, 401));
        }

        await application.remove();

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully",
        });
    } catch (err) {
        console.log(err);
    }

});


export const applyToApplication = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        let formData = req.body;
        console.log(formData)

        const application = await Application.findOne({ jobId: id });
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new AppError('User not found.', 404));
        }
        if (!application) {
            return next(new AppError('Application not found.', 404));
        }

        // Check if the user has already applied
        const alreadyApplied = application.appliedBy.some(appliedUser =>
            appliedUser.user.toString() === req.user.id
        );

        if (alreadyApplied) {
            return next(new AppError('You have already applied to this application.', 400));
        }

        // create a form response
        formData.filledBy = user.id;
        formData.applicationId = application._id;
        formData.department = application.department;
        formData.courseId = application.courseId;

        const form = await Form.create(formData);

        if (!form) {
            return next(new AppError('Error in form submission.', 400));
        }

        // Add the user's _id to the appliedBy array
        application.appliedBy.push({
            user: req.user.id,
            form: form._id
        });
        user.appliedFor.push({
            applicationId: application._id,
            formId: form._id
        })
        await application.save();
        await user.save();


        //sending email.
        const emailSubject = "Application Submitted Successfully";
        const emailMessage = `Hello ${user.fullName},<br><br>
    Your application for the position of "${application.title}" has been submitted successfully for JobID: ${application.jobId} <br><br>
    You will be notified once a decision has been made.<br><br>
    Regards,<br>
    GTAMS Support Team`;

        await sendEmail(user.email, emailSubject, emailMessage);

        return res.status(200).json({
            success: true,
            message: "Applied successfully for Job Id " + application.jobId,
        });
    } catch (err) { console.log(err) }

});


export const getAllJobs = asyncHandler(async (req, res, next) => {
    const jobs = await Application.find({});
    res.status(200).json({
        success: true,
        message: 'Fetched all Jobs',
        jobs
    })
})


export const getApplicationByJobId = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const application = await Application.findOne({ jobId })

    if (!application) {
        return next(new AppError('Application not found.', 404));
    }

    res.status(200).json({
        success: true,
        application,
        message: 'Application found.',
    })
})


export const getAllJobsByUserId = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    const user = await User.findById(id)
        .populate({
            path: 'appliedFor',
            populate: [
                { path: 'applicationId', select: 'title courseId' },
                { path: 'formId', select: '_id status appliedDate' }
            ]
        });

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    // Flatten the applications array
    const applications = user.appliedFor.map(application => ({
        title: application.applicationId.title,
        courseId: application.applicationId.courseId,
        status: application.formId.status,
        appliedDate: application.formId.appliedDate,
        formId: application.formId._id,
    }));

    res.status(200).json({
        success: true,
        message: 'All applications fetched successfully',
        applications
    });
});
