const mongoose = require('mongoose');// Importerar Mongoose för att hantera databasscheman.

const TrainingSchema = new mongoose.Schema({
    // Grundläggande info
    technique: { 
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    
    // Ny detaljerad information
    date: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: Number, // i minuter
        min: 0,
    },
    notes: {
        type: String,
        maxlength: 1000,
    },
    sparringPartner: {
        type: String,
    },
    
    // Träningstyp och nivå
    type: {
        type: String,
        enum: ['Gi', 'No-Gi', 'Drilling', 'Sparring', 'Open Mat', 'Private'],
        default: 'Gi',
    },
    beltLevel: {
        type: String,
        enum: ['White', 'Blue', 'Purple', 'Brown', 'Black'],
    },
    
    // Personlig bedömning
    mood: {
        type: Number,
        min: 1,
        max: 5, // 1 = dåligt humör, 5 = utmärkt humör
    },
    energy: {
        type: Number,
        min: 1,
        max: 5, // 1 = låg energi, 5 = hög energi
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 5, // 1 = lätt, 5 = mycket svårt
    },
    
    // Framtida: länk till användare
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },
    
}, {
    timestamps: true // Lägger automatiskt till createdAt och updatedAt
});

module.exports = mongoose.model('Training', TrainingSchema);// Exporterar modellen för att kunna använda den i andra delar av applikationen.