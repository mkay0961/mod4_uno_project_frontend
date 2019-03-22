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
      winner: null,
      game_status: 'Pending',
      turn: 0,
      loaded: false
    }
  }

  getURL(){
    return 'http://localhost:3000/games/1'
  }

  componentDidMount() {
    fetch(this.getURL())
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
    console.log("PLAY CARD");
    let pastActiveCard = this.state.active_card

    let player = {...this.state.players[this.state.turn]}

    player.cards = player.cards.filter((c)=>c!==card)
    let updatedPlayers = [...this.state.players]
    updatedPlayers.splice(this.state.turn,1,player)
    console.log(this.state.players[this.state.turn]);
    this.setState({
      active_card: card,
      deck: [pastActiveCard, ...this.state.deck].sort(() => Math.random() - 0.5),
      players: updatedPlayers
    },()=>{this.checkWin()
          this.changeTurn()
        })



  }
  changeTurn(){
    console.log("cur CHANGE TURN",(this.state.turn +1), ((this.state.turn) % this.state.players.length));

    this.setState({
      turn: ((this.state.turn +1) % this.state.players.length)
    })
  }

  updateBackend(){
    console.log("GONNA FETCH");
    let data = {}
    data.game_status = this.state.game_status
    data.winner = this.state.winner
    data.active_card = this.state.active_card
    data.deck = this.state.deck
    data.players = this.state.players

    fetch(this.getURL(),{
      method: "PATCH",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => console.log(json))
  }

  checkWin(){
    console.log("CHECK WINNNN");
    let cardCount = this.state.players[this.state.turn].cards.length
    // console.log(this.state.players[this.state.turn], this.state.players[this.state.turn].cards.length);
    if(cardCount === (0)){
      this.setState({
        winner: this.state.players[this.state.turn],
        game_status: "Completed"
      })
      alert(`WINNER ${this.state.players[this.state.turn].name}`)
    }
  }

  onSelectCardClick = (card) =>{
    if(this.cardlogic(card)){
      console.log("about to call play card");
      this.playCard(card)
      // this.changeTurn()
      console.log(this.state.turn);
      for(let x= 0; x<3000;x+=1000){
        setTimeout(this.compTurn, x)
      }


    }
  }

  compTurn =() => {
    console.log("NEW COMP TURN");
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

    // this.changeTurn()
  }

  handleActiveCard = (card) =>{
    console.log("you clicked the active card", card);
  }

  saveGame = () => {
    this.updateBackend()
  }

  render() {

    return (
      this.state.loaded ?
      <div>
        <Header />
        <CompHandContainer comphand={this.state.players[1].cards}name={this.state.players[1].name}/>
        <CompHandContainer comphand={this.state.players[2].cards}name={this.state.players[2].name}/>
        <CompHandContainer comphand={this.state.players[3].cards}name={this.state.players[3].name}/>
        <GameDeckContainer handleDeckClick={this.drawcard} activeCard={this.state.active_card} handleActiveCard={this.handleActiveCard} turnCount={this.state.turn}/>
        <UserHandContainer onSelectCardClick={this.onSelectCardClick} userhand={this.state.players[0].cards} name={this.state.players[0].name} />
        <div className="save-button" onClick={this.saveGame}>
          SAVE
        </div>
      </div>
      :
      null
    )
  }

}

export default GameContainer
