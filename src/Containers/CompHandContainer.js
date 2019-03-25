import React from 'react'
import Card from '../components/Card'

const CompHandContainer = (props) => {

  return (
    <div className={`ui cards CompHandContainer `} >
      {props.hand.map( (c, index) => <Card key={index} />)}
    </div>
  )

}

export default CompHandContainer
