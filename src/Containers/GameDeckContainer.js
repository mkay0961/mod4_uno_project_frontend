import React, {Component} from 'react'
import Card from '../Components/Card'
import Deck from '../Components/Deck'


class GameDeckContainer extends Component {
  render() {
    return(
        <div className="ui cards GameDeckContainer">
            <Card data={this.props.activeCard} onSelectCardClick={this.props.handleActiveCard} />
            <Deck handleDeckClick={this.props.handleDeckClick}/>
        </div>
      )
  }

}

export default GameDeckContainer
