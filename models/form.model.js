import { model, Schema } from 'mongoose';

const formSchema = new Schema(
    {
        filledBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: 'Application',
            required: true,
        },
        status: {
            type: String,
            enum: ['Accepted', 'Rejected', 'Pending'],
            default: 'Pending',
        },
        appliedDate: Date,
        // we have to add more form related information.
        applicantName: {
            type: String,
            required: true
        },
        formId: {
            type: String,
        },
        email: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: [true, 'Department is required.']
        },
        courseId: {
            type: String,
            required: [true, 'Course Id is required.']
        },
        previousExperience: [{
            course: {
                type: String,
                required: true,
            },
            fromDate: {
                type: Date,
                required: true,
            },
            toDate: {
                type: Date,
                required: true,
            }
        }],
        resume: {
            fileName: {
                type: String,
                required: true,
            },
            cloudinaryUrl: {
                type: String,
                required: true
            },
            size: {
                type:Number,
            }
        }

    },
    {
        timestamps: true,
    }
);

const Form = model('Form', formSchema);

export default Form;
