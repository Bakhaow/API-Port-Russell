const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");
const asyncHandler = require("../middleware/asyncHandler");

const updateCatwayAvailability = async (catwayNumber) => {
  const hasActiveReservations = await Reservation.exists({
    catwayNumber,
    status: "active",
  });

  await Catway.findOneAndUpdate(
    { catwayNumber },
    { isAvailable: !hasActiveReservations }
  );
};

const ensureCatwayExists = async (catwayNumber) => {
  const catway = await Catway.findOne({ catwayNumber });
  if (!catway) {
    const error = new Error("Catway introuvable.");
    error.statusCode = 404;
    throw error;
  }
  return catway;
};

const canManageReservation = (reservation, user) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (!reservation.user) return false;
  return reservation.user.toString() === user._id.toString();
};

const hasOverlappingReservation = async ({
  catwayNumber,
  startDate,
  endDate,
  excludeId,
}) => {
  const query = {
    catwayNumber,
    status: "active",
    $or: [
      {
        startDate: { $lte: startDate },
        endDate: { $gte: startDate },
      },
      {
        startDate: { $lte: endDate },
        endDate: { $gte: endDate },
      },
      {
        startDate: { $gte: startDate },
        endDate: { $lte: endDate },
      },
    ],
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Reservation.exists(query);
};

// @desc    Get reservations
// @route   GET /api/reservations
// @access  Private
exports.getReservations = asyncHandler(async (req, res, next) => {
  const filter =
    req.user.role === "admin" ? {} : { user: req.user ? req.user._id : null };

  const reservations = await Reservation.find(filter)
    .sort({ startDate: 1 })
    .populate("user", "name email role");

  res.status(200).json({
    success: true,
    count: reservations.length,
    reservations,
  });
});

// @desc    Get reservation by id
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id).populate(
    "user",
    "name email role"
  );

  if (!reservation) {
    return res.status(404).json({
      success: false,
      message: "Réservation introuvable.",
    });
  }

  if (!canManageReservation(reservation, req.user)) {
    return res.status(403).json({
      success: false,
      message: "Accès interdit pour cette réservation.",
    });
  }

  res.status(200).json({
    success: true,
    reservation,
  });
});

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = asyncHandler(async (req, res, next) => {
  const { catwayNumber, clientName, boatName, startDate, endDate, status } =
    req.body;

  if (!catwayNumber || !clientName || !boatName || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont requis pour créer une réservation.",
    });
  }

  const parsedStart = new Date(startDate);
  const parsedEnd = new Date(endDate);

  if (parsedStart >= parsedEnd) {
    return res.status(400).json({
      success: false,
      message: "La date de fin doit être postérieure à la date de début.",
    });
  }

  await ensureCatwayExists(Number(catwayNumber));

  const overlap = await hasOverlappingReservation({
    catwayNumber: Number(catwayNumber),
    startDate: parsedStart,
    endDate: parsedEnd,
  });

  if (overlap) {
    return res.status(400).json({
      success: false,
      message: "Ce catway est déjà réservé pour cette période.",
    });
  }

  const reservation = await Reservation.create({
    catwayNumber: Number(catwayNumber),
    clientName,
    boatName,
    startDate: parsedStart,
    endDate: parsedEnd,
    status: status || "active",
    user:
      req.user.role === "admin" && req.body.userId
        ? req.body.userId
        : req.user._id,
  });

  await updateCatwayAvailability(reservation.catwayNumber);

  res.status(201).json({
    success: true,
    reservation,
  });
});

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({
      success: false,
      message: "Réservation introuvable.",
    });
  }

  if (!canManageReservation(reservation, req.user)) {
    return res.status(403).json({
      success: false,
      message: "Accès interdit pour cette réservation.",
    });
  }

  const updates = { ...req.body };

  if (updates.catwayNumber) {
    updates.catwayNumber = Number(updates.catwayNumber);
    await ensureCatwayExists(updates.catwayNumber);
  }

  if (updates.startDate) {
    updates.startDate = new Date(updates.startDate);
  }

  if (updates.endDate) {
    updates.endDate = new Date(updates.endDate);
  }

  if (updates.startDate && updates.endDate) {
    if (updates.startDate >= updates.endDate) {
      return res.status(400).json({
        success: false,
        message: "La date de fin doit être postérieure à la date de début.",
      });
    }
  }

  const overlap = await hasOverlappingReservation({
    catwayNumber: updates.catwayNumber || reservation.catwayNumber,
    startDate: updates.startDate || reservation.startDate,
    endDate: updates.endDate || reservation.endDate,
    excludeId: reservation._id,
  });

  if (overlap) {
    return res.status(400).json({
      success: false,
      message: "Ce catway est déjà réservé pour cette période.",
    });
  }

  const previousCatwayNumber = reservation.catwayNumber;

  Object.assign(reservation, updates);
  await reservation.save();

  await updateCatwayAvailability(previousCatwayNumber);
  await updateCatwayAvailability(reservation.catwayNumber);

  res.status(200).json({
    success: true,
    reservation,
  });
});

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.deleteReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({
      success: false,
      message: "Réservation introuvable.",
    });
  }

  if (!canManageReservation(reservation, req.user)) {
    return res.status(403).json({
      success: false,
      message: "Accès interdit pour cette réservation.",
    });
  }

  const catwayNumber = reservation.catwayNumber;

  await reservation.deleteOne();
  await updateCatwayAvailability(catwayNumber);

  res.status(200).json({
    success: true,
    message: "Réservation supprimée avec succès.",
  });
});

