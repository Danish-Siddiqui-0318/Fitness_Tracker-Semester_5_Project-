import React from 'react'
import Navbar from '../Components/Navbar'
import { Hero } from '../Components/Hero'

function Home() {
  return (
    <div className='bg-black text-white min-h-screen pt-14' >
      <Navbar />
      <Hero />
    </div>
  )
}

export default Home