
import React, {Component} from 'react'
import UserHandContainer from './UserHandContainer'
import GameDeckContainer from './GameDeckContainer'
import CompHandContainer from './CompHandContainer'

class GameContainer extends Component {

  constructor() {
    super()
    this.state = {
      deck: [],
      active_card: null,
      players: [],
      winner: null,
      game_status: 'Pending'
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/games/1')
    .then(res => res.json())
    .then(game => this.processJson(game) )
  }

  processJson(game){
    this.setState({
      deck: game.deck,
      active_card: game.active_card,
      players: game.players
    })
  }

  render() {
    return (
      <div>
        UNO!
        <CompHandContainer />
        <GameDeckContainer />
        <UserHandContainer />
      </div>
    )
  }

}

export default GameContainer
