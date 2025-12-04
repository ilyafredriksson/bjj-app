const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    toggleFavoriteTechnique,
} = require('../controllers/authController');

// POST /api/auth/register - Registrera ny användare
router.post('/register', register);

// POST /api/auth/login - Logga in
router.post('/login', login);

// GET /api/auth/profile - Hämta användarprofil (kräver auth)
router.get('/profile', authMiddleware, getProfile);

// PUT /api/auth/profile - Uppdatera profil (kräver auth)
router.put('/profile', authMiddleware, updateProfile);

// POST /api/auth/favorites - Lägg till/ta bort favorit-teknik (kräver auth)
router.post('/favorites', authMiddleware, toggleFavoriteTechnique);

module.exports = router;
