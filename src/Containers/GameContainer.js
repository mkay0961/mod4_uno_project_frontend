
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
      userhand: [],
      comp1hand: [],
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
      userhand: game.players[0].cards,
      comp1hand: game.players[1].cards,
      loaded: true
    })
  }

  cardlogic(card){
    let rtnval = false
    if (card.Number === this.state.active_card.Number ||card.Color === this.state.active_card.Color ) {
      rtnval = true
    }
    return rtnval
  }

  onSelectCardClick = (card) =>{
    console.log("you clicked card", card);
    console.log(this.cardlogic(card));
    if(this.cardlogic(card)){
      let newplayerhand = this.state.userhand
      newplayerhand = newplayerhand.filter((c)=>c!==card)

      this.setState({
        deck: [this.state.active_card, ...this.state.deck],
        active_card: card,
        userhand: newplayerhand
      })
    }

  }
  handleActiveCard = (card) =>{
    console.log("you clicked the active card", card);
  }
  handleDeckClick = () =>{
    console.log(this.state.deck.length);
    if(this.state.deck.length > 0){
      let drawnCard = this.state.deck.pop()
      let updatedDeck = this.state.deck
      updatedDeck = updatedDeck.filter((c)=>c!==drawnCard)
      this.setState({
        deck: updatedDeck,
        userhand: [...this.state.userhand, drawnCard]
      })
    }else{
      console.log("no more cards in deck");
    }
  }

  render() {
    return (
      this.state.loaded ?
      <div>
        <Header />
        <CompHandContainer comphand={this.state.comp1hand}name={this.state.players[1].name}/>
        <GameDeckContainer handleDeckClick={this.handleDeckClick} activeCard={this.state.active_card} handleActiveCard={this.handleActiveCard}/>
        <UserHandContainer onSelectCardClick={this.onSelectCardClick} userhand={this.state.userhand} name={this.state.players[0].name} />
      </div>
      :
      null
    )
  }

}

export default GameContainer
