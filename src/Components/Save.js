import React from 'react'

const Save = (props) => {

  return (
    <div >
      <button className="ui button" onClick={()=>props.saveGame()}>Save Game</button>
    </div>
  )
}

export default Save
