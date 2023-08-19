import { useState } from 'react'



function InGameInterface() {
  const n = 11
  const myArray = new Array(n).fill(0);
  const picStyles = {"width":`${Math.min(100/n,100/3)}%`}
  // const cardName = '9_of_clubs.svg'
  const cardName = 'back.svg'
  const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  
  return (
    <>
    <figure className='top' >
  
    </figure>
    <figure className='left' >
    
    </figure>

    <figure className='right'>
    
    </figure>

    <figure className='bot' style = {n>10?{paddingInlineStart:`${(n-1)*10}px`}:null}>
        {myArray.map( (e,i)=><img src= {cardPath} style = {n>10?{...picStyles,"right":i*10}:picStyles}   alt="" />)}  
    </figure>
    </>
    

      
  )
}
export default InGameInterface
