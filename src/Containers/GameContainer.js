import React, {Component} from 'react'
import UserHandContainer from './UserHandContainer'
import GameDeckContainer from './GameDeckContainer'
import CompHandContainer from './CompHandContainer'
import Save from '../components/Save'
import NewGame from '../components/NewGame'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const url = () => 'http://localhost:3000/games/1'

class GameContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: null,
      reversed: false,
      deck: [],
      activeCard: null,
      fakeActiveCard: {color: ""},
      players: [],
      winner: null,
      gameStatus: 'Pending',
      paused: false,
      turn: 0
    }
  }

  componentDidMount() {
    setInterval(()=>{this.checkCompTurn()},1500)
    fetch( url() )
    .then( res => res.json() )
    .then(game => this.initGame(game) )
  }

  checkCompTurn(){
    let turn = this.state.turn
    if(turn !== 0 && !this.state.paused){
      this.compTurn(turn)
    }
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
    let {number, color} = this.state.activeCard
    if(card.color === color || card.number === number){
      return true
    }else if (card.color === "wild") {
      return true
    }else if (card.color === this.state.fakeActiveCard.color) {
      return true
    }else{
      return false
    }
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

  drawCard = (turn) => {
    //removes one card from the deck and adds it to the current players hand

    let player = {...this.state.players[turn]}
    let deck = [...this.state.deck]


    if (deck.length > 0 ) {

        let drawnCard = deck.pop()

        deck = deck.filter(c => c !== drawnCard)

        player.cards = [...player.cards, drawnCard]


        let updatedPlayers = [...this.state.players]
        updatedPlayers.splice(turn, 1, player)

        this.setState({
          deck: deck,
          players: updatedPlayers
        })

    } else {
      window.alert('the game is broken')
      this.setState({gameStatus:'Completed'})
    }

  }

  drawExtra(turn, amount){
    let newTurn = null
    if(this.state.reversed){
      newTurn = turn -1
      if(newTurn < 0){
        newTurn = 3
      }
    }else{
      newTurn = turn +1
      if(newTurn > 3){
        newTurn = 0
      }
    }

    let player = {...this.state.players[newTurn]}
    let deck = [...this.state.deck]
    let drawnCards = []
    console.log("DECK=",deck);
    for (let i=0; i<amount ; i++) {
      drawnCards.push(deck.pop())
    }

    deck = deck.filter(c => !drawnCards.includes(c))
    console.log("DECK=",deck);
    player.cards = [...player.cards, ...drawnCards]


    let updatedPlayers = [...this.state.players]
    updatedPlayers.splice(newTurn, 1, player)

    return updatedPlayers
  }



  changeColor = () => {
    if (this.state.turn === 0 ) {
      this.setState({paused: true})
      let promise = MySwal.fire({
        title:"Select Your New Color",
        input: 'radio',
        inputOptions: ["Red", "Yellow", "Blue", "Green"],
        inputValidator: (value) => {
          if (!value) {
              return 'You need to choose something!'
            }
        }
      })

      promise.then((res)=>{
        this.setState({
          paused: false,
          fakeActiveCard: {color: ["red", "yellow", "blue", "green"][res.value] }
        })
      })

    }else{
      let randomColor = ["red", "yellow", "blue", "green"][Math.floor(Math.random()*4)]
      this.setState({fakeActiveCard: {color: randomColor }})
    }
  }

  playCard = (card, turn) => {

    let updatedPlayers = [...this.state.players]

    this.setState({fakeActiveCard: {color: ""}})
    switch(card.number){
      case("reverse"):
        this.setState({reversed: !this.state.reversed})
        console.log("reverse")
        break;
      case("skip"):
        console.log("skip");
        this.changeTurn()
        break;
      case("draw2"):
        updatedPlayers = this.drawExtra(turn, 2)
        console.log("draw2");
        break;
      case("color"):
        this.changeColor()
        console.log("rand color");
        break;
      case("draw4"):
        updatedPlayers = this.drawExtra(turn, 4)
        this.changeColor()
        console.log("draw4");
        break;
    }

    let player = {...this.state.players[turn]}
    let pastActiveCard = this.state.activeCard

    player.cards = player.cards.filter(c => c !== card)

    updatedPlayers.splice(turn, 1, player)

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
    let turn = this.state.turn
    document.getElementById(`person-${turn}`).classList.add("highlight-person")

    if(this.state.reversed){
      let newTurn = turn - 1
      if(newTurn < 0){
        newTurn = 3
      }
      this.setState({
        turn: newTurn
      },()=>{document.getElementById(`person-${turn}`).classList.remove("highlight-person")})

    }else{
      this.setState({
        turn: ((turn +1) % this.state.players.length)
      },()=>{document.getElementById(`person-${turn}`).classList.remove("highlight-person")})
    }

  }

  handleCardClick = (card) => {
    let turn = this.state.turn
    if(turn === 0 && this.checkValidMove(card)){
      this.playCard(card,turn)
      // for (let x = 0; x < 3000; x += 1000) {
      //   setTimeout(this.compTurn, x)
      // }
    }
  }

  compTurn = (turn) => {
    let potentialMoves = this.state.players[turn].cards.filter(card => this.checkValidMove(card))
    while (potentialMoves.length === 0) {
      this.drawCard(turn)
      potentialMoves = this.state.players[turn].cards.filter(card => this.checkValidMove(card))
    }

    //computer selects a random card from their possible plays
    let card = potentialMoves[Math.floor(Math.random()*potentialMoves.length)]
    this.playCard(card, turn)
  }


  getPostURL(){
    return url().slice(0, -2);
  }

  newGame = () => {
    console.log("new game")

    let data = {name: "Phil"}

    fetch(this.getPostURL(),{
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(json => this.initGame(json))
    }

  handleActiveCard = (card) => {
    console.log("you clicked the active card", card);
  }

  saveGame = () => {
    this.updateBackend()
  }

  sortClick = () =>{
     console.log("sortme");
  }

  updateBackend(){
    console.log("GONNA FETCH");
    let data = {}
    data.id = this.state.id
    data.game_status = this.state.gameStatus
    data.winner = this.state.winner
    data.active_card = this.state.activeCard
    data.deck = this.state.deck
    data.players = this.state.players

    fetch(url(),{
      method: "PATCH",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(json => console.log("GAME SAVED", json))
  }

  render() {
    return (
      this.state.gameStatus === 'In Progress' ?
        <div className="grid-container">
          <div className="item1" id={`person-${1}`} >
            <div className="name" >{this.state.players[1].name}</div>
            <CompHandContainer
              person={"1"}
              hand={this.state.players[1].cards}
              name={this.state.players[1].name}
            />
            </div>
          <div className="item2" id={`person-${2}`}>
            <div className="name">{this.state.players[2].name}</div>
            <CompHandContainer
              hand={this.state.players[2].cards}
              name={this.state.players[2].name}
            />
          </div>
          <div className="item3" id={`person-${3}`}>
            <div className="name" >{this.state.players[3].name}</div>
            <CompHandContainer
              hand={this.state.players[3].cards}
              name={this.state.players[3].name}
            />
          </div>
          <div className="item4">
            <GameDeckContainer
              handleDeckClick={this.drawCard}
              turn={this.state.turn}
              activeCard={this.state.activeCard}
              handleActiveCard={this.handleActiveCard}
              turnName={this.state.players[this.state.turn].name}
              fakerColor={this.state.fakeActiveCard}
            />
          </div>
          <div className="item5" id={`person-${0}`}>
            <div className="name" >{this.state.players[0].name}</div>
            <UserHandContainer
              sortClick={this.sortClick}
              handleCardClick={this.handleCardClick}
              hand={this.state.players[0].cards}
              name={this.state.players[0].name}
            />
        </div>
        <div className="item6">
          <Save saveGame={this.saveGame}/>
        </div>
        <div className="item7">
          <NewGame newGame={this.newGame}/>
        </div>
      </div>
      :
      null
    )
  }

}

export default GameContainer
