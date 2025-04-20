import React, { useContext, useState } from 'react'
import { PetContext } from '../context/PetContext'
import {
  FaHeart,
  FaRegHeart,
  FaDog,
  FaCat,
  FaEdit,
  FaTrash,
  FaCheck
} from 'react-icons/fa'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'

const PetCard = ({ pet, adminActions = false }) => {
  const { toggleFavorite, favorites, deletePet } = useContext(PetContext)
  const isFav = favorites.includes(pet.id)
  const [adopted, setAdopted] = useState(false)
  const navigate = useNavigate()

  // Determina la clasificación por edad
  const getClassification = (age) => {
    if (age < 1) return 'Cachorro'
    if (age < 7) return 'Adulto'
    return 'Senior'
  }
  const classification = pet.classification || getClassification(pet.age)

  // Modal eliminar
  const handleDelete = () => {
    Swal.fire({
      title: '¿Eliminar mascota?',
      text: `¿Seguro que deseas eliminar a "${pet.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      draggable: true // permite mover el modal
    }).then(result => {
      if (result.isConfirmed) {
        deletePet(pet.id)
        toast.success('Mascota eliminada')
      }
    })
  }

  // Modal adoptar
  const handleAdopt = () => {
    Swal.fire({
      title: '¿Adoptar mascota?',
      text: `¿Deseas adoptar a "${pet.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '¡Adoptar!',
      cancelButtonText: 'Cancelar',
      draggable: true // permite mover el modal
    }).then(result => {
      if (result.isConfirmed) {
        setAdopted(true)
        toast.success('¡Gracias por adoptar!')
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 }
        })
      }
    })
  }

  // Diferencia visual clara entre modo claro y oscuro
  const cardBg = adopted
    ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700'
    : 'bg-white dark:bg-indigo-900 border-green-200 dark:border-yellow-900'

  return (
    <div
      className={`${cardBg} rounded-2xl shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden
        w-full max-w-xs mx-auto border-2
        hover:scale-105 hover:rotate-1 hover:shadow-2xl
      `}
      style={{
        minHeight: 320,
        opacity: adopted ? 0.7 : 1
      }}
    >
      {/* Imagen */}
      <div className={`aspect-[4/3] w-full overflow-hidden ${
        adopted
          ? 'bg-gradient-to-tr from-green-200 via-green-100 to-green-300 dark:from-green-900 dark:via-green-800 dark:to-green-900'
          : 'bg-gradient-to-tr from-green-100 via-blue-100 to-pink-100 dark:from-indigo-800 dark:via-purple-900 dark:to-blue-900'
      }`}>
        {pet.photo ? (
          <img
            src={pet.photo}
            alt={pet.name}
            className="object-contain w-full h-full transition-transform duration-300 hover:scale-105 bg-pink-50 dark:bg-pink-200"
            style={{}}
          />
        ) : (
          <img
            src="/default-pet.jpg"
            alt="Mascota sin foto"
            className="object-contain w-full h-full opacity-60 bg-pink-50 dark:bg-pink-300"
            style={{}}
          />
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-lg font-extrabold tracking-wide ${adopted ? 'text-green-700 dark:text-green-200' : 'text-green-800 dark:text-yellow-200'}`}>
            {pet.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(pet.id)
            }}
            className="text-red-500 text-xl hover:scale-125 transition"
            title="Favorito"
            disabled={adopted}
          >
            {isFav ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="mt-1 text-xs text-gray-700 dark:text-gray-200 flex items-center gap-2">
          {pet.type === 'Perro'
            ? <FaDog className="text-green-500 dark:text-yellow-300" />
            : <FaCat className="text-pink-500 dark:text-yellow-200" />}
          <span>{pet.type} • {pet.gender} • {pet.age} años</span>
        </div>

        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold shadow
          ${adopted
            ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
            : 'bg-blue-100 text-blue-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
          {classification}
        </span>

        {/* Descripción SIEMPRE visible */}
        <div className="mt-2 text-xs text-gray-800 dark:text-yellow-100 min-h-[36px]">
          {pet.description || 'Sin descripción'}
        </div>

        {/* Botones CRUD + Adoptar */}
        <div className={`flex flex-col items-center gap-2 mt-4`}>
          {adminActions && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => navigate(`/items/${pet.id}/edit`)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-800 transition"
                title="Editar"
                disabled={adopted}
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition"
                title="Eliminar"
                disabled={adopted}
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          )}
          <button
            onClick={handleAdopt}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-base font-bold shadow-lg mt-2
              transition-all duration-200
              ${adopted
                ? 'bg-green-300 dark:bg-green-800 text-green-900 dark:text-green-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
              }`}
            title={adopted ? 'Ya adoptado' : 'Adoptar'}
            disabled={adopted}
          >
            <FaCheck /> {adopted ? 'Adoptado' : 'Adoptar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PetCard
