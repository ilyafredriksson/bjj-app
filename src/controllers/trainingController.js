const Training = require('../models/training');// Importerar modellen Training för att arbeta med träningsdata.

//Hämta alla träningar
getTrainings =async (req,res) =>{// Asynkron funktion för att hantera GET-förfrågningar.
    try{
        const trainings = await Training.find();// Hämtar alla träningsposter från databasen.
        res.status(200).json(trainings);// Returnerar de hämtade posterna med status 
    } catch (error){
        res.status(500).json({ error:error.message});
    }
}

// Skapa en ny träning
createTraining = async (req, res) => { //funktion för att hantera POST förfrågningar
    const { technique, instructor } = req.body; // data från "body"
    try {
        console.log(technique, instructor)
        const newTraining = new Training({technique,instructor}) //skapar ny post i data basen
        console.log(newTraining)
        const training = await newTraining.save(); // skapar ny post i databasen
        res.status(201).json(training);
    }catch(error){
        res.status(500).json({error:error.message})
    }
 };

 //Uppdatera en träning 
 updateTraining = async (req,res)=> { //funktion för att PUT förfrågningar
    try{
        const{id} = req.params // Hämtar tränings-ID från förfrågningens parametrar.
        const updateTraining = await Training.findByIdAndUpdate(id,req.body,{new:true})// Uppdaterar träningsposten i databasen.
        res.status(200).json(updateTraining)
    }catch(error){
        res.status(500).json({error: error.message})
    }
 }

 // Ta bort en träning
 deleteTraining = async(req,res) =>{//funktion för att hantera DELETE-förfrågningar.
    try{
        const{id} = req.params; // hämtar tränings ID
        await Training.findByIdAndDelete(id)//radera träningposten från databasen
        res.status(200).json ({message: 'Training deleted successfully'})

    }catch(error){
        res.status(500).json({error:error. message})
    }
 }
 getTrainingById = async (req, res) => {
    try {
        const { id } = req.params;
        const training = await Training.findById(id);
        if (!training) {
            return res.status(404).json({ message: 'Training not found' });
        }
        res.status(200).json(training);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTraining, getTrainings,updateTraining,deleteTraining,getTrainingById }