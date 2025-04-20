import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Favorites from '../pages/Favorites'
import ItemList from '../pages/ItemList'
import ItemDetail from '../pages/ItemDetail'
import ItemCreate from '../pages/ItemCreate'
import ItemEdit from '../pages/ItemEdit'
import NotFound from '../pages/NotFound'

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/favoritos" element={<Favorites />} />
    <Route path="/items" element={<ItemList />} />
    <Route path="/items/create" element={<ItemCreate />} />
    <Route path="/items/:id" element={<ItemDetail />} />
    <Route path="/items/:id/edit" element={<ItemEdit />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRouter
