const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            require: false,
            default: null,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: /^[0-9]{10,15}$/,
        },
        address: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "doctor", "patient"],
            required: true,
        },
        image: {
            type: String,
            default:
                "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
