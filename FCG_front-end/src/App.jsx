import { useState } from 'react'

import './App.css'

function App() {
  const myArray = new Array(10).fill(0);
  const cardName = '9_of_clubs.svg'
  const cardPath = "public\\SVG-cards-1.3\\" + cardName
  return (
      <figure>
        
        {myArray.map(e=><img src= {cardPath}alt="" />)}
      </figure>
  )
}

export default App
