const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Grundläggande info
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    
    // Profil info
    fullName: {
        type: String,
        trim: true,
    },
    profileImage: {
        type: String, // URL till profilbild
    },
    
    // BJJ-specifik info
    currentBelt: {
        type: String,
        enum: ['White', 'Blue', 'Purple', 'Brown', 'Black'],
        default: 'White',
    },
    stripes: {
        type: Number,
        min: 0,
        max: 4,
        default: 0,
    },
    academy: {
        type: String, // Vilken klubb/academy
    },
    startDate: {
        type: Date, // När började du träna BJJ
    },
    
    // Preferenser
    preferredGi: {
        type: String,
        enum: ['Gi', 'No-Gi', 'Both'],
        default: 'Both',
    },
    weight: {
        type: Number, // i kg
    },
    height: {
        type: Number, // i cm
    },
    
    // Favoriter (referenser till andra dokument)
    favoriteTechniques: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technique',
    }],
    
    // Mål
    goals: [{
        description: String,
        targetDate: Date,
        completed: {
            type: Boolean,
            default: false,
        },
        completedDate: Date,
    }],
    
    // Account status
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['user', 'instructor', 'admin'],
        default: 'user',
    },
    
}, {
    timestamps: true,
});

// Hash password innan den sparas
UserSchema.pre('save', async function(next) {
    // Kör endast om password är modifierat
    if (!this.isModified('password')) return next();
    
    try {
        // Generera salt och hasha password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Metod för att jämföra passwords vid login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Ta bort password från JSON response (säkerhet)
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', UserSchema);
