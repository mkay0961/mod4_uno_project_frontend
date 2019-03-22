
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
      playerOne: null,
      playerTwo: null,
      playerOneHand: [],
      playerTwoHand: [],
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
      playerOne: game.players[0],
      playerTwo: game.players[1],
      playerOneHand: game.players[0].cards,
      playerTwoHand: game.players[1].cards
    })
  }

  render() {
    return (
      <div>
        <Header />
        <CompHandContainer compHand={this.state.playerTwoHand}/>
        <GameDeckContainer activeCard={this.state.active_card} />
        <UserHandContainer userHand={this.state.playerOneHand}/>
      </div>
    )
  }

}

export default GameContainer
