const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // --- ADD THESE NEW FIELDS ---
    isAdmin: {
        type: Boolean,
        default: false // Default to false for regular users
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    // ----------------------------
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;