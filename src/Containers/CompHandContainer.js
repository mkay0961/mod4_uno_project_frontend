import React, {Component} from 'react'
import Card from '../Components/Card'

class CompHandContainer extends Component {

  render() {
    return (
      <div className="ui cards CompHandContainer">
        Computers cards are displayed here
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    )
  }

}

export default CompHandContainer
