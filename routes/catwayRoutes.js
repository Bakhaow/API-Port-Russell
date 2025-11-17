const express = require("express");
const {
  getCatways,
  getCatway,
  createCatway,
  updateCatway,
  deleteCatway,
} = require("../controllers/catwayController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getCatways).post(
  protect,
  authorize("admin"),
  createCatway
);

router
  .route("/:catwayNumber")
  .get(protect, getCatway)
  .put(protect, authorize("admin"), updateCatway)
  .delete(protect, authorize("admin"), deleteCatway);

module.exports = router;

