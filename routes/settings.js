const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settings");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureAuth, settingsController.getSettings);

router.post("/changeUserName", settingsController.changeUserName);

router.post("/changeUserEmail", settingsController.changeUserEmail);

module.exports = router
