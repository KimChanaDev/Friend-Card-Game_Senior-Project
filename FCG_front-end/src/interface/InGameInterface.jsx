import { useState } from 'react'

import './IngameInterface.css'
import PlayerCard from '../component/PlayerCard';
function InGameInterface() {
  const n = 9
  const myArray = new Array(n).fill(0);
  const picStyles = {"width":`${Math.min(100/(n),100/9)}%`}
  const cardName = '9_of_clubs.svg'
  // const cardName = 'back.svg'
  const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  const offset = 10
  return (
    <>
    <figure className='top' >
  
    </figure>
    <figure className='left' >
      <PlayerCard/>
    </figure>

    <figure className='right'>
    
    </figure>

    <figure className='bot' style = {{paddingInlineStart:`${(n-1)*offset}px`}}>
        {myArray.map( (e,i)=><img src= {cardPath} style = {{...picStyles,"right":i*offset}}   alt="" />)}  
    </figure>
    </>
    

      
  )
}
export default InGameInterface
