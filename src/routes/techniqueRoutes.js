const express = require('express');
const router = express.Router();
const {
    getTechniques,
    getTechniqueById,
    createTechnique,
    updateTechnique,
    deleteTechnique,
    toggleFavorite,
} = require('../controllers/techniqueController');

// GET /api/techniques - Hämta alla tekniker (med optional query params för filter)
router.get('/', getTechniques);

// GET /api/techniques/:id - Hämta specifik teknik
router.get('/:id', getTechniqueById);

// POST /api/techniques - Skapa ny teknik
router.post('/', createTechnique);

// PUT /api/techniques/:id - Uppdatera teknik
router.put('/:id', updateTechnique);

// DELETE /api/techniques/:id - Ta bort teknik
router.delete('/:id', deleteTechnique);

// POST /api/techniques/:id/favorite - Markera som favorit
router.post('/:id/favorite', toggleFavorite);

module.exports = router;
