const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAdminUsers,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.get("/admin/users", verifyToken, requireRole("admin"), getAdminUsers);

module.exports = router;
