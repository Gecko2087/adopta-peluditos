import React, { useState, useEffect, useContext } from 'react'
import { PetContext } from '../context/PetContext'
import { useParams, useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'

const MAX_AGE = { Perro: 20, Gato: 25 }

const ItemEdit = () => {
  const { id } = useParams()
  const { getPet, updatePet } = useContext(PetContext)
  const [form, setForm] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getPet(id)
      .then(data => {
        if (isMounted) {
          setForm(data)
          setPreview(data?.photo || '')
          setError('')
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'No se pudo cargar la mascota. Intenta más tarde.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [id, getPet])

  if (loading) return <p className="p-8">Cargando...</p>
  if (error) return <p className="p-8 text-red-500">{error}</p>
  if (!form) return <p className="p-8">Mascota no encontrada.</p>

  const validate = (fields = form) => {
    const newErrors = {}
    if (!fields.name.trim()) newErrors.name = 'El nombre es obligatorio.'
    if (!fields.type) newErrors.type = 'El tipo es obligatorio.'
    if (!fields.gender) newErrors.gender = 'El género es obligatorio.'
    if (fields.age === '') newErrors.age = 'La edad es obligatoria.'
    else if (isNaN(fields.age) || fields.age < 0) newErrors.age = 'La edad debe ser un número mayor o igual a 0.'
    else if (fields.type && MAX_AGE[fields.type] && Number(fields.age) > MAX_AGE[fields.type])
      newErrors.age = `La edad máxima para un ${fields.type.toLowerCase()} es ${MAX_AGE[fields.type]} años.`
    return newErrors
  }

  const handleChange = e => {
    const { name, value, files } = e.target
    let val = value
    if (name === 'photo' && files.length) {
      const reader = new FileReader()
      reader.onload = ev => setPreview(ev.target.result)
      reader.readAsDataURL(files[0])
      setForm(f => ({ ...f, photo: files[0] }))
      return
    }
    if (name === 'age') val = val.replace(/[^0-9.]/g, '')
    setForm(f => {
      const updated = { ...f, [name]: val }
      setErrors(validate({ ...updated, age: name === 'age' ? val : updated.age }))
      return updated
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const validation = validate()
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      setSaving(false)
      return
    }
    let photoData = ''
    if (form.photo && typeof form.photo !== 'string') {
      photoData = await new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = ev => resolve(ev.target.result)
        reader.readAsDataURL(form.photo)
      })
    } else {
      photoData = form.photo
    }
    try {
      await updatePet(id, { ...form, photo: photoData })
      navigate(`/items/${id}`)
    } catch {
      setError('No se pudo guardar. Espera unos segundos e intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/items')
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-2 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-yellow-700 dark:text-yellow-300 drop-shadow">
        Editar Mascota
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col gap-5"
        noValidate
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className={`p-3 rounded border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold`}
          required
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className={`p-3 rounded border ${errors.type ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold`}
          required
          aria-invalid={!!errors.type}
        >
          <option value="">Tipo</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
        {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className={`p-3 rounded border ${errors.gender ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold`}
          required
          aria-invalid={!!errors.gender}
        >
          <option value="">Género</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          placeholder="Edad (años)"
          className={`p-3 rounded border ${errors.age ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold`}
          required
          min={0}
          max={form.type && MAX_AGE[form.type] ? MAX_AGE[form.type] : undefined}
          aria-invalid={!!errors.age}
        />
        {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
        {preview && (
          <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded mx-auto shadow" />
        )}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold"
        />
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-bold transition"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center gap-2 flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded font-bold transition"
            disabled={saving}
          >
            <FaTimes /> Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ItemEdit
