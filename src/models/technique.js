const mongoose = require('mongoose');

const TechniqueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Submissions', 'Sweeps', 'Passes', 'Escapes', 'Takedowns', 'Positions', 'Defenses'],
    },
    position: {
        type: String,
        required: true,
        // T.ex: Guard, Mount, Side Control, Back Control, etc.
    },
    difficulty: {
        type: String,
        enum: ['Nybörjare', 'Mellan', 'Avancerad'],
        default: 'Nybörjare',
    },
    description: {
        type: String,
        maxlength: 2000,
    },
    steps: [{
        type: String, // Array med steg-för-steg instruktioner
    }],
    videoUrl: {
        type: String, // YouTube, Vimeo, eller egen hosting
    },
    imageUrl: {
        type: String, // URL till bild
    },
    tags: [{
        type: String, // T.ex: "fundamental", "competition", "self-defense"
    }],
    beltLevel: {
        type: String,
        enum: ['White', 'Blue', 'Purple', 'Brown', 'Black', 'All'],
        default: 'All',
    },
    
    // Om du vill att användare kan lägga till egna tekniker
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },
    // isPublic: {
    //     type: Boolean,
    //     default: true,
    // },
    
    // Statistik
    viewCount: {
        type: Number,
        default: 0,
    },
    favoriteCount: {
        type: Number,
        default: 0,
    },
    
}, {
    timestamps: true,
});

// Index för snabbare sökningar
TechniqueSchema.index({ name: 'text', description: 'text', tags: 'text' });
TechniqueSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Technique', TechniqueSchema);
