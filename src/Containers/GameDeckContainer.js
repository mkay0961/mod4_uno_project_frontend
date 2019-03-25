import React from 'react'
import Card from '../components/Card'
import Deck from '../components/Deck'

const GameDeckContainer = (props) => {

  return(
    <div className="ui cards GameDeckContainer">
    {(props.fakerColor.color)?
      <div className={`card-${props.fakerColor.color}`}>
      </div>
      :
      null
    }
      <Card data={props.activeCard} handleCardClick={props.handleActiveCard} />
      <Deck handleDeckClick={props.handleDeckClick}
            turn={props.turn}
      />
      <div>
        {`The current turn is: ${props.turnName}`}
      </div>
    </div>
  )

}

export default GameDeckContainer
