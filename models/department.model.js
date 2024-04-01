import { model, Schema } from 'mongoose';


const departmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }]
});

const Department = model('Department', departmentSchema);

export default Department;
