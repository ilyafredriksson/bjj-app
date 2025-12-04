const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware för att verifiera JWT token
const authMiddleware = async (req, res, next) => {
    try {
        // Hämta token från header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Ingen token, åtkomst nekad' 
            });
        }
        
        // Verifiera token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key-change-in-production'
        );
        
        // Hitta användare
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Token är inte giltig' 
            });
        }
        
        // Lägg till user till request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ 
            message: 'Token är inte giltig',
            error: error.message 
        });
    }
};

// Optional auth - fortsätt även om ingen token finns
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key-change-in-production'
            );
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        // Fortsätt ändå även om token är ogiltig
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };
