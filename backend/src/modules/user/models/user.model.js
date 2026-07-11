const { Schema, model } = require("mongoose");
const { ROLES, CUSTOMER } = require("../../../shared/constants/roles");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        role: {
            type: String,
            enum: Object.values(ROLES),
            default: CUSTOMER
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);


const User = model("User", userSchema);

module.exports = User;