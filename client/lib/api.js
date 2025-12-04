// API Base URL - anpassa detta till din Express server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

// Hämta alla träningar
export async function getTrainings() {
  try {
    const response = await fetch(`${API_BASE_URL}/trainings`)
    if (!response.ok) throw new Error('Kunde inte hämta träningar')
    return await response.json()
  } catch (error) {
    console.error('Fel vid hämtning av träningar:', error)
    throw error
  }
}

// Hämta en specifik träning
export async function getTrainingById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/trainings/${id}`)
    if (!response.ok) throw new Error('Kunde inte hämta träning')
    return await response.json()
  } catch (error) {
    console.error('Fel vid hämtning av träning:', error)
    throw error
  }
}

// Skapa ny träning
export async function createTraining(trainingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/trainings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingData),
    })
    if (!response.ok) throw new Error('Kunde inte skapa träning')
    return await response.json()
  } catch (error) {
    console.error('Fel vid skapande av träning:', error)
    throw error
  }
}

// Uppdatera träning
export async function updateTraining(id, trainingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/trainings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingData),
    })
    if (!response.ok) throw new Error('Kunde inte uppdatera träning')
    return await response.json()
  } catch (error) {
    console.error('Fel vid uppdatering av träning:', error)
    throw error
  }
}

// Ta bort träning
export async function deleteTraining(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/trainings/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Kunde inte ta bort träning')
    return await response.json()
  } catch (error) {
    console.error('Fel vid borttagning av träning:', error)
    throw error
  }
}
