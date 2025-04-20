import React, { useContext, useState } from 'react'
import { PetContext } from '../context/PetContext'
import PetCard from '../components/PetCard'
import { FaSearch } from 'react-icons/fa'

const Home = () => {
  const { pets, loading } = useContext(PetContext)
  const [filterType, setFilterType] = useState('Todos')
  const [filterGender, setFilterGender] = useState('Todos')
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(6)

  const filteredPets = pets.filter(pet =>
    (filterType === 'Todos' ? true : pet.type === filterType) &&
    (filterGender === 'Todos' ? true : pet.gender === filterGender) &&
    pet.name.toLowerCase().includes(search.toLowerCase())
  )

  const visiblePets = filteredPets.slice(0, visibleCount)

  return (
    <div className="min-h-screen w-full transition-all duration-300 px-2 py-8">
      <div className="w-full">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-green-600 dark:text-yellow-300 drop-shadow">
          En busca de un hogar <span role="img" aria-label="huella">🐾</span>
        </h2>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8">
          <span className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-xl shadow-md">
            Adopta una mascota y cambiá su vida <b>(¡y la tuya también!)</b>
          </span>
        </p>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-8">
          <select
            value={filterType}
            onChange={e => {
              setFilterType(e.target.value)
              setVisibleCount(6)
            }}
            className="border-2 border-green-400 dark:border-purple-500 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-purple-400"
          >
            <option value="Todos">Todos</option>
            <option value="Perro">Perros</option>
            <option value="Gato">Gatos</option>
          </select>
          <select
            value={filterGender}
            onChange={e => {
              setFilterGender(e.target.value)
              setVisibleCount(6)
            }}
            className="border-2 border-green-400 dark:border-purple-500 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-purple-400"
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
              onChange={e => {
                setSearch(e.target.value)
                setVisibleCount(6)
              }}
              placeholder="Buscar por nombre..."
              className="border-2 border-green-400 dark:border-purple-500 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse shadow-lg" />
            ))}
          </div>
        ) : (
          <>
            {visiblePets.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300 text-lg font-semibold">
                No se encontraron mascotas.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {visiblePets.map(pet => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            )}
            {visiblePets.length < filteredPets.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount(c => c + 6)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 dark:from-purple-600 dark:to-blue-600 
                       text-white font-bold px-8 py-3 rounded-full shadow-lg 
                       hover:scale-105 hover:from-green-600 hover:to-teal-600 
                       dark:hover:from-purple-700 dark:hover:to-blue-700 transition"
                >
                  Cargar más
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
