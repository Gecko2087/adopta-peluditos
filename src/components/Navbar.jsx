import React, { useLayoutEffect, useEffect, useState } from 'react'
import {
  FaPaw,
  FaHome,
  FaPlus,
  FaSun,
  FaMoon,
  FaHeart,
  FaListUl
} from 'react-icons/fa'
import { PetContext } from '../context/PetContext'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  // Sincroniza el estado inicial con la clase del html
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false
    if (localStorage.theme === 'dark') return true
    if (localStorage.theme === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  const [isDark, setIsDark] = useState(getInitialTheme)

  useLayoutEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Sincroniza el estado si el usuario cambia el tema fuera de React
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (!('theme' in localStorage)) {
        setIsDark(media.matches)
      }
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  const location = useLocation()

  return (
    <nav className="w-full bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 shadow-lg">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="bg-white dark:bg-indigo-800 rounded-full p-2 shadow-lg transition-transform group-hover:scale-110">
            <FaPaw className="text-3xl text-green-500 dark:text-yellow-300 animate-bounce" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg">
            Adopta<span className="text-pink-600 dark:text-yellow-300">Peluditos</span>
          </h1>
        </Link>

        {/* Menú */}
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold hover:bg-white/30 dark:hover:bg-indigo-800/40 transition
              ${location.pathname === '/' ? 'bg-white/30 dark:bg-indigo-800/40' : 'text-gray-900 dark:text-white'}
            `}
          >
            <FaHome /> Inicio
          </Link>
          <Link
            to="/items"
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold hover:bg-white/30 dark:hover:bg-indigo-800/40 transition
              ${location.pathname.startsWith('/items') ? 'bg-white/30 dark:bg-indigo-800/40' : 'text-blue-900 dark:text-blue-200'}
            `}
          >
            <FaListUl className="text-blue-600 dark:text-blue-300" /> Mascotas
          </Link>
          <Link
            to="/favoritos"
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold hover:bg-white/30 dark:hover:bg-indigo-800/40 transition
              ${location.pathname === '/favoritos' ? 'bg-white/30 dark:bg-indigo-800/40' : 'text-pink-700 dark:text-yellow-200'}
            `}
          >
            <FaHeart className="text-red-400 dark:text-yellow-300 animate-pulse" /> Favoritos
          </Link>
          {/* Botón Agregar eliminado */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full bg-white/30 dark:bg-indigo-800/40 hover:bg-yellow-200 dark:hover:bg-yellow-400/30 transition shadow"
            title="Cambiar tema"
          >
            {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-indigo-700" />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
