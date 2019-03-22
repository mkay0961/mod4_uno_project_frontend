
import React, {Component} from 'react'
import UserHandContainer from './UserHandContainer'
import GameDeckContainer from './GameDeckContainer'
import CompHandContainer from './CompHandContainer'
import Header from '../Components/Header'

class GameContainer extends Component {

  constructor() {
    super()
    this.state = {
      deck: [],
      active_card: null,
      players: [],
      winner: null,
      game_status: 'Pending',
      loaded: false
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
      players: game.players,
      loaded: true
    })
  }

  render() {
    return (
      this.state.loaded ?
      <div>
        <Header />
        <CompHandContainer comp={this.state.players[1]}/>
        <GameDeckContainer activeCard={this.state.active_card} />
        <UserHandContainer user={this.state.players[0]}/>
      </div>
      :
      null
    )
  }

}

export default GameContainer
