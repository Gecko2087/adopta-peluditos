import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const PetContext = createContext()

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || []
    } catch {
      return []
    }
  })

  // Reemplaza esta URL con la tuya de MockAPI
  const API_URL = 'https://6801f4b881c7e9fbcc43d7c8.mockapi.io/pets'

  const fetchPets = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(API_URL)
      setPets(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const getPet = async (id) => {
    // Busca primero en el estado global
    const found = pets.find(p => String(p.id) === String(id))
    if (found) return found
    setLoading(true)
    try {
      const { data } = await axios.get(`${API_URL}/${id}`)
      return data
    } catch (err) {
      setError(err)
      // Si es error 429, lanza un mensaje especial
      if (err.response && err.response.status === 429) {
        throw new Error('Demasiadas peticiones a la API. Espera unos minutos e intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const createPet = async (petData) => {
    setLoading(true)
    try {
      const classification =
        petData.age < 1 ? 'Cachorro'
        : petData.age < 7 ? 'Adulto'
        : 'Senior'

      const { data } = await axios.post(API_URL, {
        ...petData,
        classification,
      })

      setPets(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const updatePet = async (id, petData) => {
    setLoading(true)
    try {
      const classification =
        petData.age < 1 ? 'Cachorro'
        : petData.age < 7 ? 'Adulto'
        : 'Senior'

      const { data } = await axios.put(`${API_URL}/${id}`, {
        ...petData,
        classification,
      })

      setPets(prev => prev.map(p => (p.id === id ? data : p)))
      return data
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const deletePet = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`${API_URL}/${id}`)
      setPets(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }

  useEffect(() => {
    fetchPets()
  }, [])

  return (
    <PetContext.Provider value={{
      pets,
      loading,
      error,
      favorites,
      fetchPets,
      getPet,
      createPet,
      updatePet,
      deletePet,
      toggleFavorite
    }}>
      {children}
    </PetContext.Provider>
  )
}
