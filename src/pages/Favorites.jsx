import React, { useContext, useState } from 'react'
import { PetContext } from '../context/PetContext'
import PetCard from '../components/PetCard'
import { FaTrashAlt, FaHeart, FaSearch } from 'react-icons/fa'

const Favorites = () => {
  const { pets, favorites } = useContext(PetContext)
  const [filterGender, setFilterGender] = useState('Todos')
  const [search, setSearch] = useState('')

  const favoritePets = pets.filter(p =>
    favorites.includes(p.id) &&
    (filterGender === 'Todos' ? true : p.gender === filterGender) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleClearFavorites = () => {
    localStorage.removeItem('favorites')
    location.reload()
  }

  return (
    <div className="min-h-screen w-full transition-all duration-300 px-2 py-8">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h2 className="text-4xl font-extrabold flex items-center gap-3 text-pink-600 dark:text-pink-300 drop-shadow">
            <FaHeart className="text-red-500 dark:text-red-400 animate-pulse" />
            Mascotas Favoritas
          </h2>
          {favorites.length > 0 && (
            <button
              onClick={handleClearFavorites}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 
                       dark:from-red-600 dark:to-pink-600 text-white px-6 py-2 rounded-full 
                       font-bold shadow hover:from-red-600 hover:to-pink-600 
                       dark:hover:from-red-700 dark:hover:to-pink-700 transition"
            >
              <FaTrashAlt />
              Eliminar todos
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <select
            value={filterGender}
            onChange={e => setFilterGender(e.target.value)}
            className="border-2 border-pink-400 dark:border-pink-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600"
          >
            <option value="Todos">Todos los géneros</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500 dark:text-gray-300" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="border-2 border-pink-400 dark:border-pink-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600"
            />
          </div>
        </div>

        {favoritePets.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg font-semibold 
                      bg-white/50 dark:bg-gray-800/50 rounded-lg py-8">
            No has agregado mascotas a favoritos todavía.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {favoritePets.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
