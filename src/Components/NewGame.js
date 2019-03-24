import React, {Component} from 'react'

const NewGame = (props) => {

  return (
    <div >
      <button onClick={props.newGame}>New Game</button>
    </div>
  )
}

export default NewGame
