import './SelectBot.css'

function SelectBot({func}){
    return (
        <section className="bot-panel">
            
            <button className="bot-button" onClick={()=>{func(0)}}>easy</button>
            <button className="bot-button" onClick={()=>{func(1)}}>medium</button>
            <button className="bot-button" onClick={()=>{func(2)}}>hard</button>
        
        </section>    
    )
}
export default SelectBot
