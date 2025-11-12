const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Routes de base
app.get("/", (req, res) => {
  res.json({
    message: "API Port Russell - Bienvenue!",
    version: "1.0.0",
    status: "OK",
  });
});

// Routes API (à implémenter dans les prochains milestones)
// app.use('/api/users', require('./routes/users'));
// app.use('/api/catways', require('./routes/catways'));
// app.use('/api/reservations', require('./routes/reservations'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
