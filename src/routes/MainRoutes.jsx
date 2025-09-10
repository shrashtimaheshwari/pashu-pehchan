import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home.jsx'
import Result from '../Pages/Result.jsx'
import ContactUs from '../Pages/ContactUs.jsx'
const MainRoutes = () => {
  return (
   <Routes>
    <Route path='/' element={<Home />}/>
    <Route path='/result' element={<Result />} />
    <Route path='/contact' element={<ContactUs />}/>
   </Routes>
  )
}

export default MainRoutes