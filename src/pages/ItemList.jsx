import React, { useContext, useState, useMemo } from 'react'
import { PetContext } from '../context/PetContext'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa'
import Swal from 'sweetalert2'

const PAGE_SIZE = 8

const ItemList = () => {
  const { pets, loading, deletePet } = useContext(PetContext)
  const navigate = useNavigate()
  const [filterType, setFilterType] = useState('Todos')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Filtrado por tipo y búsqueda
  const filteredPets = useMemo(
    () =>
      pets.filter(pet =>
        (filterType === 'Todos' ? true : pet.type === filterType) &&
        pet.name.toLowerCase().includes(search.toLowerCase())
      ),
    [pets, filterType, search]
  )

  // Paginación
  const totalPages = Math.ceil(filteredPets.length / PAGE_SIZE)
  const paginatedPets = filteredPets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilterChange = (e) => {
    setFilterType(e.target.value)
    setPage(1)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handlePrev = () => setPage(p => Math.max(1, p - 1))
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1))

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-green-700 dark:text-yellow-300 drop-shadow">
          Listado de Mascotas
        </h2>
        <button
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow transition"
          onClick={() => navigate('/items/create')}
        >
          <FaPlus /> Nueva Mascota
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold mr-2">Filtrar por tipo:</label>
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="border-2 border-green-400 dark:border-purple-500 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-purple-400"
          >
            <option value="Todos">Todos</option>
            <option value="Perro">Perros</option>
            <option value="Gato">Gatos</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <FaSearch className="text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre..."
            className="border-2 border-green-400 dark:border-purple-500 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-purple-400"
          />
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              title="Anterior"
            >
              <FaChevronLeft />
            </button>
            <span className="font-semibold">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              title="Siguiente"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">Cargando...</p>
      ) : filteredPets.length === 0 ? (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-8 text-center text-gray-500 dark:text-gray-300 font-semibold shadow flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="Sin mascotas"
            className="w-24 h-24 mx-auto mb-4 opacity-60"
            loading="lazy"
          />
          <span>No hay mascotas que coincidan con tu búsqueda o filtro.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-green-100 dark:bg-indigo-900 text-green-900 dark:text-yellow-200">
                <th className="p-3 text-center">Nombre</th>
                <th className="p-3 text-center">Tipo</th>
                <th className="p-3 text-center">Género</th>
                <th className="p-3 text-center">Edad</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPets.map(pet => (
                <tr
                  key={pet.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-indigo-800 transition"
                >
                  <td className="p-3 font-semibold text-center">{pet.name}</td>
                  <td className="p-3 text-center">{pet.type}</td>
                  <td className="p-3 text-center">{pet.gender}</td>
                  <td className="p-3 text-center">{pet.age}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                      onClick={() => navigate(`/items/${pet.id}`)}
                      aria-label={`Ver detalles de ${pet.name}`}
                    >
                      <FaEye /> Ver
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-800 transition"
                      onClick={() => navigate(`/items/${pet.id}/edit`)}
                      aria-label={`Editar ${pet.name}`}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition"
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: '¿Eliminar mascota?',
                          text: `¿Seguro que deseas eliminar a "${pet.name}"?`,
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#e3342f',
                          cancelButtonColor: '#6c757d',
                          confirmButtonText: 'Sí, eliminar',
                          cancelButtonText: 'Cancelar',
                          draggable: true // permite mover el modal
                        })
                        if (result.isConfirmed) {
                          await deletePet(pet.id)
                        }
                      }}
                      aria-label={`Eliminar ${pet.name}`}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Paginación abajo para mejor UX en listas largas */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
            title="Anterior"
          >
            <FaChevronLeft />
          </button>
          <span className="font-semibold">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
            title="Siguiente"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default ItemList
