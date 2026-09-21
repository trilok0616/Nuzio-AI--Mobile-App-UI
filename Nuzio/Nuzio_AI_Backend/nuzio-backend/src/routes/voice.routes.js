const express = require("express");
const { listVoices } = require("../controllers/voice.controller");

const router = express.Router();
router.get("/", listVoices);

module.exports = router;
