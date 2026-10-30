const jwt = require('jsonwebtoken');

function verifyRequest(req, res) {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return null;
    }

    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired session" });
        return null;
    }
}

function authArtist(req, res, next) {
    const decoded = verifyRequest(req, res);

    if (!decoded) return;

    if (decoded.role !== "artist") {
        return res.status(403).json({ message: "Only artists can perform this action" });
    }

    req.user = decoded;
    return next();
}

function authUser(req, res, next) {
    const decoded = verifyRequest(req, res);

    if (!decoded) return;

    if (!["user", "artist"].includes(decoded.role)) {
        return res.status(403).json({ message: "You do not have access" });
    }

    req.user = decoded;
    return next();
}

module.exports = { authArtist, authUser };
