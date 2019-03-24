import React from 'react'
import Card from '../components/Card'
import Deck from '../components/Deck'

const GameDeckContainer = (props) => {

  return(
    <div className="ui cards GameDeckContainer">
      <Card data={props.activeCard} onSelectCardClick={props.handleActiveCard} />
      <Deck handleDeckClick={props.handleDeckClick}/>
    </div>
  )

}

export default GameDeckContainer
