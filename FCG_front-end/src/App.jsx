import { useState } from 'react'

import './App.css'

function App() {
  const n = 1
  const myArray = new Array(n).fill(0);
  const picStyles = {"width":`${Math.min(100/n,100/3)}%`}
  const cardName = '9_of_clubs.svg'
  const cardPath = "public\\SVG-cards-1.3\\" + cardName
  
  return (
      <figure>
        
        {myArray.map(e=><img src= {cardPath} style = {picStyles}alt="" />)}
      </figure>
  )
}

export default App
