const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router
  .route("/")
  .get(protect, authorize("admin"), getUsers);

router
  .route("/:id")
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

module.exports = router;

