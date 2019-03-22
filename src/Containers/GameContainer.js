//add four players

//then

//ADDD INSTULTS





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
      turn: 0,
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

  cardlogic(card){
    let rtnval = false
    if (card.Number === this.state.active_card.Number ||card.Color === this.state.active_card.Color ) {
      rtnval = true
    }
    return rtnval
  }

  drawcard=()=>{
    if(this.state.deck.length > 0 ){
      let drawnCard = this.state.deck.pop()

      let updatedDeck = this.state.deck
      updatedDeck = updatedDeck.filter((c)=>c!==drawnCard)

      let player = {...this.state.players[this.state.turn]}

      player.cards = [...player.cards, drawnCard]

      let updatedPlayers = [...this.state.players]
      updatedPlayers.splice(this.state.turn,1,player)

      this.setState({
        deck: updatedDeck,
        players: updatedPlayers
      })

    }
  }

  playCard = (card) =>{
    let pastActiveCard = this.state.active_card

    let player = {...this.state.players[this.state.turn]}

    player.cards = player.cards.filter((c)=>c!==card)
    let updatedPlayers = [...this.state.players]
    updatedPlayers.splice(this.state.turn,1,player)

    this.setState({
      active_card: card,
      deck: [pastActiveCard, ...this.state.deck].sort(() => Math.random() - 0.5),
      players: updatedPlayers
    })

  }
  changeTurn(){
    this.checkWin()
    //post to backend
    this.setState({
      turn: ((this.state.turn +1) % this.state.players.length)
    })
  }

  checkWin(){
    let cardCount = this.state.players.map((player)=>{
      return player.cards.length
    })
    if(cardCount.includes(0)){
      alert(`WINNER ${this.state.players[this.state.turn].name}`)
    }
  }

  onSelectCardClick = (card) =>{
    if(this.cardlogic(card)){
      this.playCard(card)
      this.changeTurn()
      setTimeout(this.compTurn, 1000)
    }
  }

  compTurn =() => {
    let potentialMoves = this.state.players[this.state.turn].cards.filter(card => card.Number === this.state.active_card.Number || card.Color === this.state.active_card.Color)

    while (potentialMoves.length === 0) {
      //drawcard
      if(this.state.deck.length > 0){
        this.drawcard()
      }
      potentialMoves = this.state.players[this.state.turn].cards.filter(card => card.Number === this.state.active_card.Number || card.Color === this.state.active_card.Color)
    }

    //change to pic random
    let card = potentialMoves[0]

    this.playCard(card)

    this.changeTurn()
  }

  handleActiveCard = (card) =>{
    console.log("you clicked the active card", card);
  }

  render() {

    return (
      this.state.loaded ?
      <div>
        <Header />
        <CompHandContainer comphand={this.state.players[1].cards}name={this.state.players[1].name}/>
        <GameDeckContainer handleDeckClick={this.drawcard} activeCard={this.state.active_card} handleActiveCard={this.handleActiveCard} turnCount={this.state.turn}/>
        <UserHandContainer onSelectCardClick={this.onSelectCardClick} userhand={this.state.players[0].cards} name={this.state.players[0].name} />
      </div>
      :
      null
    )
  }

}

export default GameContainer
