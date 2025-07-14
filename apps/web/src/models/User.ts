import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: [true, "Please provide an email for this user."],
            unique: true,
            match: [/.+\@.+\..+/, "Please provide a valid email address."],
        },
        password: {
            type: String,
            required: [true, "Please provide a password for this user."],
        },

    }, {timestamps: true});


export default mongoose.models.User || mongoose.model("User", UserSchema);