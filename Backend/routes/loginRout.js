const { login, getMe } = require("../controllers/loginController");
const { protect } = require("../middleware/authoristionMiddleware");
const express = require("express");
const router = express.Router();
router.post("/login", login);
router.get("/me", protect, getMe);
module.exports = router;

