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
            unique: true,
        },
        instructor: String,
        requiredSkills: String,
        department: String,
        
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const Application = model('Application', applicationSchema);

export default Application;
