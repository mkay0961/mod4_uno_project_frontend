import React from 'react'

const Save = (props) => {

  return (
    <div >
      <button onClick={()=>props.saveGame()}>Save Game</button>
    </div>
  )
}

export default Save
