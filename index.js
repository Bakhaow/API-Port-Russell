const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const catwayRoutes = require("./routes/catwayRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const errorHandler = require("./middleware/errorHandler");

const path = require("path");

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
