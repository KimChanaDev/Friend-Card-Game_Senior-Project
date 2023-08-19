import { useState } from 'react'



function InGameInterface() {
  const n = 13
  const myArray = new Array(n).fill(0);
  const picStyles = {"width":`${Math.min(100/(n),100/5)}%`}
  const cardName = '9_of_clubs.svg'
  // const cardName = 'back.svg'
  const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  const offset = 0+(13-n)
  return (
    <>
    <figure className='top' >
  
    </figure>
    <figure className='left' >
    
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
