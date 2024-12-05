const mongoose = require('mongoose');// Importerar Mongoose för att hantera databasscheman.
const TrainingSchema = new mongoose.Schema({
    technique :{ //schema för träningsdata
        type: String,
        require: true,
    },
    instructor:{
        type: String,
        require: true,
    },
    
});

module.exports=mongoose.model('Training',TrainingSchema);// Exporterar modellen för att kunna använda den i andra delar av applikationen.