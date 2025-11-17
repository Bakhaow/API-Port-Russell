const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const generateToken = require("../utils/generateToken");

// Format commun de réponse avec token
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nom, email et mot de passe sont requis.",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Un utilisateur avec cet email existe déjà.",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Merci de fournir un email et un mot de passe.",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Identifiants invalides.",
    });
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const cleanedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  );

  const user = await User.findByIdAndUpdate(req.params.id, cleanedUpdates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Utilisateur introuvable.",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Utilisateur introuvable.",
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "Utilisateur supprimé avec succès.",
  });
});

