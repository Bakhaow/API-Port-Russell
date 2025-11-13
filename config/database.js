const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/port-russell";

    // Vérifier si l'URI est valide pour MongoDB Atlas
    if (mongoURI.startsWith("mongodb+srv://")) {
      // Extraire le hostname de l'URI
      const hostMatch = mongoURI.match(/@([^\/]+)/);
      if (hostMatch) {
        const hostname = hostMatch[1];
        // Vérifier si le hostname ressemble à un cluster Atlas valide
        if (
          !hostname.includes("cluster") &&
          !hostname.includes(".mongodb.net")
        ) {
          console.error(
            "⚠️  Attention : Le nom du cluster MongoDB semble incorrect.\n" +
              `   Hostname trouvé : ${hostname}\n` +
              "   Un cluster MongoDB Atlas devrait ressembler à : cluster0.xxxxx.mongodb.net\n" +
              "   Vérifiez votre URI dans MongoDB Atlas > Connect > Connect your application"
          );
        }
      }
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);

    // Messages d'erreur plus explicites
    if (error.message.includes("querySrv ENOTFOUND")) {
      console.error(
        "\n💡 Solution :\n" +
          "   1. Vérifiez que votre URI MongoDB est correcte\n" +
          "   2. Le nom du cluster doit ressembler à : cluster0.xxxxx.mongodb.net\n" +
          "   3. Obtenez la bonne URI depuis MongoDB Atlas :\n" +
          "      - Connectez-vous à MongoDB Atlas\n" +
          "      - Cliquez sur 'Connect' > 'Connect your application'\n" +
          "      - Copiez l'URI de connexion (format mongodb+srv://...)\n" +
          "   4. Vérifiez que votre cluster est actif et accessible\n"
      );
    } else if (error.message.includes("authentication failed")) {
      console.error(
        "\n💡 Solution :\n" +
          "   1. Vérifiez votre nom d'utilisateur et mot de passe\n" +
          "   2. Si votre username est un email, encodez @ en %40\n" +
          "   3. Vérifiez que l'utilisateur a les droits d'accès au cluster\n"
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
