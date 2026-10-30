const express = require('express');
const multer = require('multer');
const musicController = require('../controllers/music.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024,
        files: 1
    }
});

const router = express.Router();

router.post(
    "/upload",
    authMiddleware.authArtist,
    upload.single("music"),
    musicController.createMusic
);
router.post("/album", authMiddleware.authArtist, musicController.createAlbum);
router.get("/", authMiddleware.authUser, musicController.getAllMusic);
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);

module.exports = router;
