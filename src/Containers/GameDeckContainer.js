import React, {Component} from 'react'
import Card from '../components/Card'
import Deck from '../components/Deck'


class GameDeckContainer extends Component {
  render() {
    return(
        <div className="ui cards GameDeckContainer">
            <Card data={this.props.activeCard} onSelectCardClick={this.props.handleActiveCard} />
            <Deck handleDeckClick={this.props.handleDeckClick}/>
            <div>
              {`Current turn: player ${this.props.turnCount}`}
            </div>
        </div>
      )
  }

}

export default GameDeckContainer
