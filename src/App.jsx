import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import AppRouter from './Router/AppRouter'
import { PetProvider } from './context/PetContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <PetProvider>
      <BrowserRouter>
        <div className="w-full min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300 flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col">
            <AppRouter />
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </PetProvider>
  )
}

export default App
