const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generera JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' } // Token giltig i 7 dagar
    );
};

// Registrera ny användare
const register = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        
        // Validera input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Vänligen fyll i alla obligatoriska fält' 
            });
        }
        
        // Kolla om användare redan finns
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Användarnamn eller email är redan registrerad' 
            });
        }
        
        // Skapa ny användare
        const user = new User({
            username,
            email,
            password, // Hashas automatiskt i User-modellen
            fullName,
        });
        
        await user.save();
        
        // Generera token
        const token = generateToken(user._id);
        
        res.status(201).json({
            message: 'Användare skapad',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                currentBelt: user.currentBelt,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logga in
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validera input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Vänligen fyll i email och lösenord' 
            });
        }
        
        // Hitta användare
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Felaktigt email eller lösenord' 
            });
        }
        
        // Kolla lösenord
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Felaktigt email eller lösenord' 
            });
        }
        
        // Generera token
        const token = generateToken(user._id);
        
        res.status(200).json({
            message: 'Inloggning lyckades',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                currentBelt: user.currentBelt,
                academy: user.academy,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hämta användarprofil (kräver auth)
const getProfile = async (req, res) => {
    try {
        // req.user sätts av auth middleware
        const user = await User.findById(req.user.id)
            .populate('favoriteTechniques')
            .select('-password'); // Exkludera password
        
        if (!user) {
            return res.status(404).json({ message: 'Användare hittades inte' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Uppdatera profil
const updateProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            'fullName', 'profileImage', 'currentBelt', 'stripes',
            'academy', 'startDate', 'preferredGi', 'weight', 'height'
        ];
        
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lägg till/ta bort favorit-teknik
const toggleFavoriteTechnique = async (req, res) => {
    try {
        const { techniqueId } = req.body;
        const user = await User.findById(req.user.id);
        
        const index = user.favoriteTechniques.indexOf(techniqueId);
        
        if (index > -1) {
            // Ta bort från favoriter
            user.favoriteTechniques.splice(index, 1);
        } else {
            // Lägg till i favoriter
            user.favoriteTechniques.push(techniqueId);
        }
        
        await user.save();
        
        res.status(200).json({
            message: 'Favoriter uppdaterade',
            favoriteTechniques: user.favoriteTechniques,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    toggleFavoriteTechnique,
};
