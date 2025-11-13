const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: [true, "Le numéro de catway est requis"],
      ref: "Catway",
    },
    clientName: {
      type: String,
      required: [true, "Le nom du client est requis"],
      trim: true,
    },
    boatName: {
      type: String,
      required: [true, "Le nom du bateau est requis"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "La date de début est requise"],
    },
    endDate: {
      type: Date,
      required: [true, "La date de fin est requise"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "La date de fin doit être postérieure à la date de début",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Peut être null pour les réservations initiales importées
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// Index pour améliorer les performances de recherche
reservationSchema.index({ catwayNumber: 1 });
reservationSchema.index({ startDate: 1, endDate: 1 });
reservationSchema.index({ user: 1 });

// Validation pour éviter les chevauchements de réservations
reservationSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("startDate") || this.isModified("endDate") || this.isModified("catwayNumber")) {
    const Reservation = mongoose.model("Reservation");
    const overlapping = await Reservation.findOne({
      catwayNumber: this.catwayNumber,
      status: "active",
      _id: { $ne: this._id },
      $or: [
        {
          startDate: { $lte: this.startDate },
          endDate: { $gte: this.startDate },
        },
        {
          startDate: { $lte: this.endDate },
          endDate: { $gte: this.endDate },
        },
        {
          startDate: { $gte: this.startDate },
          endDate: { $lte: this.endDate },
        },
      ],
    });

    if (overlapping) {
      const error = new Error(
        `Ce catway est déjà réservé pour cette période (du ${overlapping.startDate.toLocaleDateString()} au ${overlapping.endDate.toLocaleDateString()})`
      );
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);

