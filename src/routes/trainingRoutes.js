const express = require('express');// importerar express för att hantera rutter
const router = express.Router()// Skapar en ny routerinstans.
const { createTraining, getTrainings, getTrainingById,updateTraining,deleteTraining } = require('../controllers/trainingController')// Importerar controller-funktioner för träningar

router.get('/', getTrainings)

router.post('/', createTraining )//en POST-rutt för att skapa en ny träning.

router.get ('/:id',getTrainingById)

router.put ('/:id',updateTraining)

router.delete('/:id', deleteTraining);

router.patch('/:id', updateTraining);

module.exports = router; // exporeterar routern för att kopplas till serever