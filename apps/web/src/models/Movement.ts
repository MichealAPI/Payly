import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
}, { timestamps: true });


const MovementSchema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['expense', "deposit"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

    subjectUser: {type: Schema.Types.ObjectId, ref: 'User'},

    comments: [CommentSchema],
}, { timestamps: true} );


export default mongoose.models.Movement || mongoose.model('Movement', MovementSchema);