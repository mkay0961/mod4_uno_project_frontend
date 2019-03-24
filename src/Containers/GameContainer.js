
import React, {Component} from 'react'
import UserHandContainer from './UserHandContainer'
import GameDeckContainer from './GameDeckContainer'
import CompHandContainer from './CompHandContainer'

const url = () => 'http://localhost:3000/games/1'

class GameContainer extends Component {

  constructor() {
    super()
    this.state = {
      deck: [],
      activeCard: null,
      players: [],
      winner: null,
      gameStatus: 'Pending',
      turn: 0
    }
  }

  componentDidMount() {
    fetch( url() )
    .then( res => res.json() )
    .then(game => this.initGame(game) )
  }

  initGame(game) {
    this.setState({
      deck: game.deck,
      activeCard: game.active_card,
      players: game.players,
      gameStatus: 'In Progress'
    })
  }

  checkValidMove(card) {
    //returns true if the played card matches the activeCard color or number, otherwise returns false
    let {Number, Color} = this.state.activeCard
    return card.Number === Number || card.Color === Color ? true : false
  }

  checkWin() {
    let activePlayer = this.state.players[this.state.turn]
    let cardCount = activePlayer.cards.length

    if (cardCount === 0) {
      this.setState({
        winner: activePlayer,
        gameStatus: "Completed"
      })
      alert(`WINNER ${activePlayer.name}`)
    }
  }

  shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5)
  }

  drawCard = () => {
    //removes one card from the deck and adds it to the current players hand
    let player = {...this.state.players[this.state.turn]}
    let deck = [...this.state.deck]
    console.log(deck)

    if (deck.length > 0 ) {
      let drawnCard = this.state.deck.pop()
      deck = deck.filter(c => c !== drawnCard)
      player.cards = [...player.cards, drawnCard]

      let updatedPlayers = [...this.state.players]
      updatedPlayers.splice(this.state.turn, 1, player)

      this.setState({
        deck: deck,
        players: updatedPlayers
      })
    } else {
      window.alert('the game is broken')
      this.setState({gameStatus:'Completed'})
    }

  }

  playCard = (card) => {
    //makes the played card the new active card, and updates the playing hand and gamestate. chains into checking for a winner and changing the turn
    let player = {...this.state.players[this.state.turn]}
    let pastActiveCard = this.state.activeCard

    player.cards = player.cards.filter(c => c !== card)

    let updatedPlayers = [...this.state.players]
    updatedPlayers.splice(this.state.turn, 1, player)

    this.setState({
      activeCard: card,
      deck: this.shuffleDeck([pastActiveCard, ...this.state.deck]),
      players: updatedPlayers
    },
    () => {
      this.checkWin()
      this.changeTurn()
      }
    )

  }

  changeTurn() {

    this.setState({
      turn: ((this.state.turn +1) % this.state.players.length)
    })

  }

  updateBackend(){
    console.log("GONNA FETCH");
    let data = {}
    data.game_status = this.state.game_status
    data.winner = this.state.winner
    data.activeCard = this.state.activeCard
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

  handleCardClick = (card) => {
    if (this.checkValidMove(card)) {
      this.playCard(card)
      for (let x = 0; x < 3000; x += 1000) {
        setTimeout(this.compTurn, x)
      }
    }

  }

  compTurn = () => {
    // let activePlayer = this.state.players[this.state.turn]
    let potentialMoves = this.state.players[this.state.turn].cards.filter(card => this.checkValidMove(card))

    while (potentialMoves.length === 0) {
      console.log('computer drawing a card');
      console.log('hello? ');
      console.log('current hand', this.state.players[this.state.turn].cards);
      this.drawCard()
      potentialMoves = this.state.players[this.state.turn].cards.filter(card => this.checkValidMove(card))
    }

    //computer selects a random card from their possible plays
    let card = potentialMoves[Math.floor(Math.random()*potentialMoves.length)]
    this.playCard(card)

  }

  handleActiveCard = (card) => {
    console.log("you clicked the active card", card);
  }

  saveGame = () => {
    this.updateBackend()
  }

  render() {
    return (
      this.state.gameStatus === 'In Progress' ?
      <div>
        <CompHandContainer
          hand={this.state.players[1].cards}
          name={this.state.players[1].name}
        />
        <CompHandContainer
          hand={this.state.players[2].cards}
          name={this.state.players[2].name}
        />
        <CompHandContainer
          hand={this.state.players[3].cards}
          name={this.state.players[3].name}
        />
        <GameDeckContainer
          handleDeckClick={this.drawCard}
          activeCard={this.state.activeCard}
          handleActiveCard={this.handleActiveCard}
          turnCount={this.state.turn}
        />
        <UserHandContainer
          handleCardClick={this.handleCardClick}
          hand={this.state.players[0].cards}
          name={this.state.players[0].name}
        />
        <div className="save-button">
          <button onClick={this.saveGame}>SAVE</button>
        </div>
      </div>
      :
      null
    )
  }

}

export default GameContainer
