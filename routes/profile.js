const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/profile", ensureAuth, profileController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);

module.exports = router
