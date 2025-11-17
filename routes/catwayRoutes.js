const express = require("express");
const {
  getCatways,
  getCatway,
  createCatway,
  updateCatway,
  deleteCatway,
} = require("../controllers/catwayController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Lister tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [short, long]
 *         description: Filtrer par type de catway
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 catways:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Catway'
 *   post:
 *     summary: Créer un nouveau catway (admin uniquement)
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *               - catwayType
 *               - catwayState
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *                 example: 25
 *               catwayType:
 *                 type: string
 *                 enum: [short, long]
 *                 example: "short"
 *               catwayState:
 *                 type: string
 *                 example: "bon état"
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 catway:
 *                   $ref: '#/components/schemas/Catway'
 */
router.route("/").get(protect, getCatways).post(
  protect,
  authorize("admin"),
  createCatway
);

/**
 * @swagger
 * /api/catways/{catwayNumber}:
 *   get:
 *     summary: Récupérer un catway par son numéro
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Détails du catway
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 catway:
 *                   $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway introuvable
 *   put:
 *     summary: Mettre à jour un catway (admin uniquement)
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayType:
 *                 type: string
 *                 enum: [short, long]
 *               catwayState:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Catway mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 catway:
 *                   $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway introuvable
 *   delete:
 *     summary: Supprimer un catway (admin uniquement)
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Catway supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Catway introuvable
 */
router
  .route("/:catwayNumber")
  .get(protect, getCatway)
  .put(protect, authorize("admin"), updateCatway)
  .delete(protect, authorize("admin"), deleteCatway);

module.exports = router;

