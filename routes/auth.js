const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup API
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log("request body: ", req.body)
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, type: "user", isActive: true });
        await user.save();

        console.log("User created successfully: ", email)

        res.status(201).json({ msg: "User created successfully" });
    } catch (err) {
        console.log("Error creating user: ", err)
        res.status(500).send("Server error");
    }
});

// Login API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        console.log("user::::", user)

        if (!user) return res.status(400).json({ msg: "No user found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).send("Server error, please try again");
    }
});

module.exports = router;
