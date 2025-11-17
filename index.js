const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const catwayRoutes = require("./routes/catwayRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const errorHandler = require("./middleware/errorHandler");

const path = require("path");

// Swagger (optionnel - seulement si les dépendances sont installées)
let swaggerUi, swaggerSpec;
try {
  swaggerUi = require("swagger-ui-express");
  swaggerSpec = require("./config/swagger");
} catch (error) {
  console.log("Swagger non disponible (dépendances non installées)");
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Connexion à MongoDB
connectDB();

// Routes de base
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Documentation Swagger (si disponible)
if (swaggerUi && swaggerSpec) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📚 Documentation Swagger disponible sur /api-docs");
}

// Routes API
app.use("/api/users", userRoutes);
app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);

// Gestion des erreurs
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
