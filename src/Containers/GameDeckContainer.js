
import React, {Component} from 'react'
import Card from '../Components/Card'

class GameDeckContainer extends Component {
  render() {
    return(
        <div className="ui cards GameDeckContainer">
            flexbox hates me
            <Card data={this.props.activeCard} />
            <Card />

        </div>
      )
  }

}

export default GameDeckContainer
