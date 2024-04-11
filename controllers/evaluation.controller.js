import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import Application from "../models/application.model.js";
import { sendEmail } from '../utils/sendEmail.js';
import Form from "../models/form.model.js";
import User from "../models/user.model.js";
import Evaluation from "../models/evaluation.model.js";



// export const createApplication = asyncHandler(async (req, res, next) => {

// })


export const addNewEvaluation = asyncHandler(async (req, res, next) => {
    const { formData, courseId, taId } = req.body;

    const evaluation = await Evaluation.findOne({
        instructor: req.user.id,
        "under": {
            $elemMatch: {
                course: courseId,
                ta: taId
            }
        }
    });

    if (!evaluation) {
        return next(new AppError('Course and TA combination not found in evaluation', 404));
    }

    // Create a new summary object
    const newSummary = {
        task: formData.task,
        rating: formData.rating,
        remark: formData.remark,
        date: new Date() // Use the current date/time
    };

    // Update the evaluation document with the new summary
    await Evaluation.updateOne(
        {
            _id: evaluation._id,
            "under": {
                $elemMatch: {
                    course: courseId,
                    ta: taId
                }
            }
        },
        {
            $push: {
                "under.$.summary": newSummary
            }
        }
    );

    res.status(201).json({
        success: true,
        message: "New evaluation added successfully."
    });
});



export const getAllCourseAndTaList = asyncHandler(async (req, res, next) => {
    const evaluation = await Evaluation.aggregate([
        {
            $match: {
                instructor: mongoose.Types.ObjectId(req.user.id)
            }
        },
        {
            $unwind: "$under"
        },
        {
            $lookup: {
                from: "users",
                localField: "under.ta",
                foreignField: "_id",
                as: "ta"
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "under.course",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $addFields: {
                "under.taName": { $arrayElemAt: ["$ta.fullName", 0] },
                "under.courseId": { $arrayElemAt: ["$course.courseId", 0] },
                "under.courseName": { $arrayElemAt: ["$course.name", 0] }
            }
        },
        {
            $project: {
                "under.ta": 1,
                "under.taName": 1,
                "under.course": 1,
                "under.courseId": 1,
                "under.courseName": 1,
                "under.summary": 1
            }
        }
    ]);

    if (!evaluation || evaluation.length === 0) {
        return next(new AppError('Instructor not found or no evaluations found', 404));
    } else {
        console.log(evaluation);
    }

    res.status(200).json({
        success: true,
        message: 'Fetched',
        data: evaluation
    });
});
