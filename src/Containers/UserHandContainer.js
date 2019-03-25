import React from 'react'
import Card from '../components/Card'


const UserHandContainer = (props) => {

  return(
    <div className="ui cards UserHandContainer">
      {props.hand.map( (c, index) => <Card handleCardClick={props.handleCardClick} key={index} data={c} />)}
      <button onClick={props.sortClick}>Sort Cards</button>
    </div>
  )

}

export default UserHandContainer
