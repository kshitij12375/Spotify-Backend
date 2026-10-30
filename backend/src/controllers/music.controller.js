const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
    const title = req.body.title?.trim();
    const file = req.file;

    if (!title) {
        return res.status(400).json({ message: "Music title is required" });
    }

    if (!file) {
        return res.status(400).json({ message: "Music file is required" });
    }

    if (!file.mimetype?.startsWith("audio/")) {
        return res.status(400).json({ message: "Only audio files are allowed" });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    if (!result?.url) {
        return res.status(502).json({ message: "Music upload failed" });
    }

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    });

    return res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    });
}

async function createAlbum(req, res) {
    const title = req.body.title?.trim();
    const musics = req.body.musics ?? [];

    if (!title) {
        return res.status(400).json({ message: "Album title is required" });
    }

    if (!Array.isArray(musics)) {
        return res.status(400).json({ message: "Musics must be an array of music IDs" });
    }

    const uniqueMusicIds = [...new Set(musics.map(String))];
    const ownedMusics = await musicModel.find({
        _id: { $in: uniqueMusicIds },
        artist: req.user.id
    }).select("_id");

    if (ownedMusics.length !== uniqueMusicIds.length) {
        return res.status(400).json({
            message: "One or more music IDs are invalid or do not belong to you"
        });
    }

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: uniqueMusicIds
    });

    return res.status(201).json({
        message: "Album created successfully",
        album,
        id: album._id
    });
}

async function getAllMusic(req, res) {
    const musics = await musicModel.find()
        .populate("artist", "username")
        .lean();

    return res.status(200).json({
        message: "Fetched music successfully",
        musics
    });
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find()
        .populate("artist", "username")
        .populate({
            path: "musics",
            populate: { path: "artist", select: "username" }
        })
        .lean();

    return res.status(200).json({
        message: "Fetched albums successfully",
        albums
    });
}

module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbums };
