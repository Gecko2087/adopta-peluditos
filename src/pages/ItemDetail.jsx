import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PetContext } from '../context/PetContext'

const ItemDetail = () => {
  const { id } = useParams()
  const { getPet } = useContext(PetContext)
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getPet(id).then(data => {
      setPet(data)
      setLoading(false)
    })
  }, [id, getPet])

  if (loading) return <p className="p-8">Cargando...</p>
  if (!pet) return <p className="p-8">Mascota no encontrada.</p>

  return (
    <div className="max-w-xl mx-auto py-8 px-2">
      <button
        className="mb-4 text-blue-600"
        onClick={() => navigate('/items')}
      >
        &larr; Volver al listado
      </button>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
        <img src={pet.photo} alt={pet.name} className="w-48 h-48 object-cover rounded mb-4 mx-auto" />
        <h2 className="text-2xl font-bold mb-2">{pet.name}</h2>
        <p><b>Tipo:</b> {pet.type}</p>
        <p><b>Género:</b> {pet.gender}</p>
        <p><b>Edad:</b> {pet.age}</p>
        <p><b>Clasificación:</b> {pet.classification}</p>
        <p className="mt-2">{pet.description}</p>
        <button
          className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/items/${pet.id}/edit`)}
        >
          Editar
        </button>
      </div>
    </div>
  )
}

export default ItemDetail
