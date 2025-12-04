const Technique = require('../models/technique');

// Hämta alla tekniker med optional filtering
const getTechniques = async (req, res) => {
    try {
        const { category, difficulty, position, search } = req.query;
        
        let query = {};
        
        // Filtrera efter category
        if (category) query.category = category;
        
        // Filtrera efter difficulty
        if (difficulty) query.difficulty = difficulty;
        
        // Filtrera efter position
        if (position) query.position = position;
        
        // Textsökning
        if (search) {
            query.$text = { $search: search };
        }
        
        const techniques = await Technique.find(query).sort({ createdAt: -1 });
        res.status(200).json(techniques);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hämta en specifik teknik
const getTechniqueById = async (req, res) => {
    try {
        const { id } = req.params;
        const technique = await Technique.findById(id);
        
        if (!technique) {
            return res.status(404).json({ message: 'Technique not found' });
        }
        
        // Öka viewCount
        technique.viewCount += 1;
        await technique.save();
        
        res.status(200).json(technique);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Skapa ny teknik
const createTechnique = async (req, res) => {
    try {
        const newTechnique = new Technique(req.body);
        const technique = await newTechnique.save();
        res.status(201).json(technique);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Uppdatera teknik
const updateTechnique = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTechnique = await Technique.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedTechnique) {
            return res.status(404).json({ message: 'Technique not found' });
        }
        
        res.status(200).json(updatedTechnique);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ta bort teknik
const deleteTechnique = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTechnique = await Technique.findByIdAndDelete(id);
        
        if (!deletedTechnique) {
            return res.status(404).json({ message: 'Technique not found' });
        }
        
        res.status(200).json({ message: 'Technique deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Favoritmarkera teknik (öka favoriteCount)
const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const { isFavorite } = req.body; // true eller false
        
        const technique = await Technique.findById(id);
        if (!technique) {
            return res.status(404).json({ message: 'Technique not found' });
        }
        
        // Öka eller minska favoriteCount
        technique.favoriteCount += isFavorite ? 1 : -1;
        technique.favoriteCount = Math.max(0, technique.favoriteCount); // Aldrig negativ
        
        await technique.save();
        res.status(200).json(technique);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTechniques,
    getTechniqueById,
    createTechnique,
    updateTechnique,
    deleteTechnique,
    toggleFavorite,
};
