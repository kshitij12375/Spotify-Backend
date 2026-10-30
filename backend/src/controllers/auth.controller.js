const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

function createToken(user) {
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not configured");
    }

    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
    );
}

async function registerUser(req, res) {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const role = req.body.role ?? "user";

    if (!username || !email || typeof password !== "string") {
        return res.status(400).json({ message: "Username, email and password are required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!["user", "artist"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    });

    const token = createToken(user);
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function loginUser(req, res) {
    const email = req.body.email?.trim().toLowerCase();
    const username = req.body.username?.trim();
    const password = req.body.password;

    if ((!email && !username) || typeof password !== "string" || !password) {
        return res.status(400).json({ message: "Email/username and password are required" });
    }

    const user = await userModel.findOne({
        $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
        ]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
        message: "User login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function getCurrentUser(req, res) {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json({ message: "User logout successful" });
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
