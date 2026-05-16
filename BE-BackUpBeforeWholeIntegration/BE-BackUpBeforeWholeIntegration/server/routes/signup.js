const express = require("express");
const { createUser } = require("../controllers/StudentCont/userController");
const { createGenUser } = require("../controllers/AdminCont/GenUserController");
const router = express.Router();

// POST a new User
router.post("/", createUser);
router.post("/", createGenUser);

module.exports = router;
