const express = require('express')
const mongoose = require('mongoose')// Importerar Mongoose för att ansluta till MongoDB.
const bodyParser = require('body-parser');// Importerar body-parser för att hantera JSON-data i förfrågningar.
const cors = require('cors');
require('dotenv').config();// Laddar miljövariabler från en .env-fil.

const app =express();
const PORT = process.env.PORT  || 5001; // standard port 

//Middlewear
app.use(cors());// tillåta förfrågningar från andra domän
app.use(bodyParser.urlencoded({ extended: true}))// stöd  för JSON-data i inkommande förfrågningar
app.use(express.json())

// Routes
app.use('/api/trainings', require('./routes/trainingRoutes'))
app.use('/api/techniques', require('./routes/techniqueRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))

//Anslutning till  MongoDB
mongoose.connect(process.env.MONGO_URI) // Ansluter till databasen.})
.then(()=>console.log('connected to MongoDB')) // meddelande om man är ansluten
.catch(error=>console.error(error));//meddelande om mislyckad anslutning

app.listen(PORT,()=>{
    console.log(`Server running on localhost:${PORT}`);
})




