// API Base URL - anpassa detta till din Express server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

// ============= TRAININGS API =============

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

// ============= TECHNIQUES API =============

// Hämta alla tekniker med optional filters
export async function getTechniques(filters = {}) {
  try {
    const queryParams = new URLSearchParams()
    if (filters.category) queryParams.append('category', filters.category)
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty)
    if (filters.position) queryParams.append('position', filters.position)
    if (filters.search) queryParams.append('search', filters.search)
    
    const url = `${API_BASE_URL}/techniques${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Kunde inte hämta tekniker')
    return await response.json()
  } catch (error) {
    console.error('Fel vid hämtning av tekniker:', error)
    throw error
  }
}

// Hämta en specifik teknik
export async function getTechniqueById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/techniques/${id}`)
    if (!response.ok) throw new Error('Kunde inte hämta teknik')
    return await response.json()
  } catch (error) {
    console.error('Fel vid hämtning av teknik:', error)
    throw error
  }
}

// Skapa ny teknik
export async function createTechnique(techniqueData) {
  try {
    const response = await fetch(`${API_BASE_URL}/techniques`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(techniqueData),
    })
    if (!response.ok) throw new Error('Kunde inte skapa teknik')
    return await response.json()
  } catch (error) {
    console.error('Fel vid skapande av teknik:', error)
    throw error
  }
}

// Uppdatera teknik
export async function updateTechnique(id, techniqueData) {
  try {
    const response = await fetch(`${API_BASE_URL}/techniques/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(techniqueData),
    })
    if (!response.ok) throw new Error('Kunde inte uppdatera teknik')
    return await response.json()
  } catch (error) {
    console.error('Fel vid uppdatering av teknik:', error)
    throw error
  }
}

// Ta bort teknik
export async function deleteTechnique(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/techniques/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Kunde inte ta bort teknik')
    return await response.json()
  } catch (error) {
    console.error('Fel vid borttagning av teknik:', error)
    throw error
  }
}

// ============= AUTH API =============

// Registrera ny användare
export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte registrera användare')
    }
    return await response.json()
  } catch (error) {
    console.error('Fel vid registrering:', error)
    throw error
  }
}

// Logga in
export async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte logga in')
    }
    return await response.json()
  } catch (error) {
    console.error('Fel vid inloggning:', error)
    throw error
  }
}

// Hämta användarprofil (kräver token)
export async function getProfile(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Kunde inte hämta profil')
    return await response.json()
  } catch (error) {
    console.error('Fel vid hämtning av profil:', error)
    throw error
  }
}

// Uppdatera profil (kräver token)
export async function updateProfile(token, profileData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })
    if (!response.ok) throw new Error('Kunde inte uppdatera profil')
    return await response.json()
  } catch (error) {
    console.error('Fel vid uppdatering av profil:', error)
    throw error
  }
}
