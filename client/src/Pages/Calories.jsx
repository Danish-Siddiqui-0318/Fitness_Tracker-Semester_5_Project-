import React from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'

function Calories() {
  const navigate = useNavigate()
  return (
    <>
      <Navbar />
      <h1>Calories</h1>
      <button onClick={() => { navigate("/addCalories") }}> ADD calories</button>
    </>
  )
}

export default Calories