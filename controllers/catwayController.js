const Catway = require("../models/Catway");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all catways
// @route   GET /api/catways
// @access  Private
exports.getCatways = asyncHandler(async (req, res, next) => {
  const filters = {};

  if (req.query.type) {
    filters.catwayType = req.query.type;
  }

  if (req.query.available) {
    filters.isAvailable = req.query.available === "true";
  }

  const catways = await Catway.find(filters).sort({ catwayNumber: 1 });

  res.status(200).json({
    success: true,
    count: catways.length,
    catways,
  });
});

// @desc    Get catway by number
// @route   GET /api/catways/:catwayNumber
// @access  Private
exports.getCatway = asyncHandler(async (req, res, next) => {
  const catway = await Catway.findOne({
    catwayNumber: Number(req.params.catwayNumber),
  });

  if (!catway) {
    return res.status(404).json({
      success: false,
      message: "Catway introuvable.",
    });
  }

  res.status(200).json({
    success: true,
    catway,
  });
});

// @desc    Create new catway
// @route   POST /api/catways
// @access  Private/Admin
exports.createCatway = asyncHandler(async (req, res, next) => {
  const catway = await Catway.create(req.body);

  res.status(201).json({
    success: true,
    catway,
  });
});

// @desc    Update catway
// @route   PUT /api/catways/:catwayNumber
// @access  Private/Admin
exports.updateCatway = asyncHandler(async (req, res, next) => {
  const catway = await Catway.findOneAndUpdate(
    { catwayNumber: Number(req.params.catwayNumber) },
    req.body,
    { new: true, runValidators: true }
  );

  if (!catway) {
    return res.status(404).json({
      success: false,
      message: "Catway introuvable.",
    });
  }

  res.status(200).json({
    success: true,
    catway,
  });
});

// @desc    Delete catway
// @route   DELETE /api/catways/:catwayNumber
// @access  Private/Admin
exports.deleteCatway = asyncHandler(async (req, res, next) => {
  const catway = await Catway.findOne({
    catwayNumber: Number(req.params.catwayNumber),
  });

  if (!catway) {
    return res.status(404).json({
      success: false,
      message: "Catway introuvable.",
    });
  }

  await catway.deleteOne();

  res.status(200).json({
    success: true,
    message: "Catway supprimé avec succès.",
  });
});

