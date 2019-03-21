
import React, {Component} from 'react'
import Card from '../Components/Card'

class GameDeckContainer extends Component {
  render() {
    return(
        <div className="ui cards GameDeckContainer">
            The deck and active card go here
            <Card data={this.props.activecard} />
            <Card />

        </div>
      )
  }

}

export default GameDeckContainer
