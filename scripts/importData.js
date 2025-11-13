require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const connectDB = require("../config/database");
const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

// Chemin vers les fichiers JSON
const catwaysPath = path.join(
  __dirname,
  "../../neededs/api/catways.json"
);
const reservationsPath = path.join(
  __dirname,
  "../../neededs/api/reservations.json"
);

const importData = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Lire et parser les fichiers JSON
    const catwaysData = JSON.parse(
      fs.readFileSync(catwaysPath, "utf8")
    );
    const reservationsData = JSON.parse(
      fs.readFileSync(reservationsPath, "utf8")
    );

    // Supprimer les données existantes (optionnel - commentez si vous voulez garder les données existantes)
    console.log("🗑️  Suppression des données existantes...");
    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    console.log("✅ Données existantes supprimées");

    // Importer les catways
    console.log("\n📦 Import des catways...");
    const catways = await Catway.insertMany(catwaysData);
    console.log(`✅ ${catways.length} catways importés avec succès`);

    // Importer les réservations
    console.log("\n📦 Import des réservations...");
    
    // Convertir les dates ISO en objets Date
    const reservationsToImport = reservationsData.map((reservation) => ({
      ...reservation,
      startDate: new Date(reservation.startDate),
      endDate: new Date(reservation.endDate),
    }));

    const reservations = await Reservation.insertMany(reservationsToImport);
    console.log(`✅ ${reservations.length} réservations importées avec succès`);

    // Mettre à jour la disponibilité des catways
    console.log("\n🔄 Mise à jour de la disponibilité des catways...");
    const reservedCatwayNumbers = reservations.map((r) => r.catwayNumber);
    await Catway.updateMany(
      { catwayNumber: { $in: reservedCatwayNumbers } },
      { isAvailable: false }
    );
    console.log("✅ Disponibilité des catways mise à jour");

    // Afficher un résumé
    console.log("\n📊 Résumé de l'import :");
    console.log(`   - Catways : ${catways.length}`);
    console.log(`   - Réservations : ${reservations.length}`);
    console.log(
      `   - Catways réservés : ${reservedCatwayNumbers.length}`
    );
    console.log(
      `   - Catways disponibles : ${catways.length - reservedCatwayNumbers.length}`
    );

    console.log("\n✅ Import terminé avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de l'import :", error.message);
    process.exit(1);
  }
};

// Exécuter l'import
importData();

