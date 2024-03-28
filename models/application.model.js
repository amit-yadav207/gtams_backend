import { model, Schema } from 'mongoose';

const applicationSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        courseId: {
            type: String,
            unique: true, //key to search the application
        },
        instructor: String,
        requiredSkills: String,
        department: String,
        jobId: {
            type: String,
            unique: [true, 'Job Id must be unique.'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        appliedBy: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                form: {
                    type: Schema.Types.ObjectId,
                    ref: 'Form',
                },
               
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Application = model('Application', applicationSchema);

export default Application;
