import React, {Component} from 'react'
import Card from '../Components/Card'


class UserHandContainer extends Component {

  render() {
    return(
      <div className="ui cards UserHandContainer">
        Users cards are displayed here
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    )
  }

}

export default UserHandContainer
