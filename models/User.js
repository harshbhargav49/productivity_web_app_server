const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: String, default: new Date },
    isActive: { type: Boolean, default: true },
    type: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
