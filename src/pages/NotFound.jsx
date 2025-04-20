import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
    <p className="text-xl mb-6">Página no encontrada</p>
    <Link to="/" className="text-blue-600 underline">Volver al inicio</Link>
  </div>
)

export default NotFound
