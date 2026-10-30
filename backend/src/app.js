const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

const rootDir = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(rootDir, "../frontend/dist")));
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(rootDir, "../frontend/dist/index.html"));
    });
}

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.code === "LIMIT_FILE_SIZE" ? "Audio file must be 25MB or smaller" : err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
