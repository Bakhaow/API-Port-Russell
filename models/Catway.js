const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: [true, "Le numéro de catway est requis"],
      unique: true,
      min: [1, "Le numéro de catway doit être positif"],
    },
    catwayType: {
      type: String,
      required: [true, "Le type de catway est requis"],
      enum: {
        values: ["short", "long"],
        message: "Le type de catway doit être 'short' ou 'long'",
      },
    },
    catwayState: {
      type: String,
      required: [true, "L'état du catway est requis"],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// Index pour améliorer les performances de recherche
catwaySchema.index({ catwayNumber: 1 });
catwaySchema.index({ isAvailable: 1 });

module.exports = mongoose.model("Catway", catwaySchema);

