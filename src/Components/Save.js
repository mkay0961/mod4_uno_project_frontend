import React, {Component} from 'react'

const Save = (props) => {

  return (
    <div >
      <button onClick={()=>props.handleSave()}>Save Game</button>
    </div>
  )
}

export default Save
