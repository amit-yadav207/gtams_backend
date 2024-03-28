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
        // we have to add more form related information.
    },
    {
        timestamps: true,
    }
);

const Form = model('Form', formSchema);

export default Form;
