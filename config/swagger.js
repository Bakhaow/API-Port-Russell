const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Port Russell",
      version: "1.0.0",
      description:
        "API REST pour la gestion d'un port de plaisance avec système de réservation de catways.",
      contact: {
        name: "Bakhaow",
        url: "https://github.com/Bakhaow/API-Port-Russell",
      },
      license: {
        name: "UNLICENSED",
        url: "https://github.com/Bakhaow/API-Port-Russell/blob/main/LICENSE",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID unique de l'utilisateur",
            },
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "Rôle de l'utilisateur",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Catway: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID unique du catway",
            },
            catwayNumber: {
              type: "integer",
              description: "Numéro du catway",
            },
            catwayType: {
              type: "string",
              enum: ["short", "long"],
              description: "Type de catway",
            },
            catwayState: {
              type: "string",
              description: "État du catway",
            },
            isAvailable: {
              type: "boolean",
              description: "Disponibilité du catway",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Reservation: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID unique de la réservation",
            },
            catwayNumber: {
              type: "integer",
              description: "Numéro du catway réservé",
            },
            clientName: {
              type: "string",
              description: "Nom du client",
            },
            boatName: {
              type: "string",
              description: "Nom du bateau",
            },
            startDate: {
              type: "string",
              format: "date-time",
              description: "Date de début de la réservation",
            },
            endDate: {
              type: "string",
              format: "date-time",
              description: "Date de fin de la réservation",
            },
            status: {
              type: "string",
              enum: ["active", "completed", "cancelled"],
              description: "Statut de la réservation",
            },
            user: {
              type: "string",
              description: "ID de l'utilisateur propriétaire",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Message d'erreur",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentification et gestion des utilisateurs",
      },
      {
        name: "Catways",
        description: "Gestion des catways",
      },
      {
        name: "Reservations",
        description: "Gestion des réservations",
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

