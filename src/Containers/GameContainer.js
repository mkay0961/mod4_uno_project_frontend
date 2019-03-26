import React, {Component} from 'react'
import UserHandContainer from './UserHandContainer'
import GameDeckContainer from './GameDeckContainer'
import CompHandContainer from './CompHandContainer'
import Save from '../components/Save'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import  {Link} from 'react-router-dom'


const MySwal = withReactContent(Swal)


const url = () => 'http://localhost:3000/games/'

const insults = () => [
  "youre losing",
  "why are you so bad",
  "you should probably catch up",
  "youre doing great",
  "lol..."
]


class GameContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: null,
      reversed: false,
      userHand: [],
      comp1Hand: [],
      comp2Hand: [],
      comp3Hand: [],
      hands: [],
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

  initGame(game) {
    let deck = []
    let userHand = []
    let comp1Hand = []
    let comp2Hand = []
    let comp3Hand = []
    let activeCard
    for (const i of game.cards) {
      if (i.game_position === 0) {
        userHand.push(i)
      } else if (i.game_position === 1) {
        comp1Hand.push(i)
      } else if (i.game_position === 2) {
        comp2Hand.push(i)
      } else if (i.game_position === 3) {
        comp3Hand.push(i)
      }else if (i.game_position === 4) {
        activeCard = i
      } else {
        deck.push(i)
      }
    }
    let players = game.game_players.sort((a,b) => a.seat - b.seat)

    if (game.game_status === "not started") {
      deck = this.shuffleDeck(deck)
      userHand = deck.slice(0,5)
      comp1Hand = deck.slice(5,10)
      comp2Hand = deck.slice(10,15)
      comp3Hand = deck.slice(15,20)
      deck = deck.slice(20)
      activeCard = deck[0]
      while (activeCard.color === 'wild') {
        activeCard = this.shuffleDeck(deck)[0]
      }
      deck = deck.slice(1)
    }

    this.setState({
      deck: deck,
      activeCard: activeCard,
      userHand: userHand,
      comp1Hand: comp1Hand,
      comp2Hand: comp2Hand,
      comp3Hand: comp3Hand,
      hands: [userHand, comp1Hand, comp2Hand, comp3Hand],
      players: players,
      gameStatus: 'In Progress'
    })
  }

  componentDidMount() {

    setInterval(()=>{this.checkCompTurn()},1500)
    fetch( url()+this.props.gameId )
    .then( res => res.json() )
    .then(game => this.initGame(game) )
    setInterval(()=>{this.insultPlayer()}, 5000)
  }

  insultPlayer = () => {
    if (1 === 0) {
    let insult = insults()[Math.floor(Math.random()*insults().length)]
    console.log(insult)
    }
  }

  checkCompTurn(){
    // if(this.state.players[0].cards.length < this.state.players[this.state.turn].cards.length){
    //   console.log(`Comp ${this.state.turn} says`, this.randomMessage());
    // }
    let turn = this.state.turn
    if(turn !== 0 && !this.state.paused){
      this.compTurn(turn)
    }
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
    let activePlayer = this.state.players[this.state.turn].player
    let cardCount = this.state.hands[this.state.turn].length

    if (cardCount === 0) {
      this.setState({
        winner: activePlayer,
        gameStatus: "Completed"
      })
      this.saveGame()
      let promise = MySwal.fire({
        title:`${activePlayer.name} IS THE WINNER`,
      })
      promise.then(this.props.history.push("/games"))
      // alert(`${activePlayer.name} IS THE WINNER`)
      // this.props.history.push("/games")
    }
  }

  shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5)
  }

  getActiveHand = (turn) => {
    if (turn === 0) {
      return [...this.state.userHand]
    } else if (turn === 1) {
      return [...this.state.comp1Hand]
    } else if (turn === 2) {
      return [...this.state.comp2Hand]
    } else if (turn === 3) {
      return [...this.state.comp3Hand]
    }
  }

  drawCard = (turn) => {
    //removes one card from the deck and adds it to the current players hand
    let newHands = [...this.state.hands]
    let activeHand = newHands[turn]
    let deck = [...this.state.deck]

    if (deck.length > 0 ) {
        let drawnCard = deck.pop()
        deck = deck.filter(c => c !== drawnCard)
        activeHand.push(drawnCard)

        newHands.splice(turn, 1, activeHand)

        this.setState({
          deck: deck,
          hands: newHands
        })

    } else {
      window.alert('the game is broken')
      this.setState({gameStatus:'Completed'})
    }

  }

  drawExtra(turn, amount){
    let newTurn
    if(this.state.reversed){
      newTurn = turn - 1
      if(newTurn < 0){
        newTurn = 3
      }
    }else{
      newTurn = turn + 1
      if(newTurn > 3){
        newTurn = 0
      }
    }

    let activeHand = [...this.state.hands[newTurn]]
    let deck = [...this.state.deck]
    let drawnCards = []
    for (let i=0; i<amount ; i++) {
      drawnCards.push(deck.pop())
    }

    deck = deck.filter(c => !drawnCards.includes(c))
    activeHand = [...activeHand, ...drawnCards]

    let newHands = [...this.state.hands]
    newHands.splice(newTurn, 1, activeHand)

    return newHands
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

    let newHands = [...this.state.hands]
    let activeHand = newHands[turn]

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
        newHands = this.drawExtra(turn, 2)
        console.log("draw2");
        break;
      case("color"):
        this.changeColor()
        console.log("rand color");
        break;
      case("draw4"):
        newHands = this.drawExtra(turn, 4)
        this.changeColor()
        console.log("draw4");
        break;
    }

    // let player = {...this.state.players[turn]}
    let pastActiveCard = this.state.activeCard

    activeHand = activeHand.filter(c => c !== card)
    newHands.splice(turn, 1, activeHand)

    this.setState({
      activeCard: card,
      deck: this.shuffleDeck([pastActiveCard, ...this.state.deck]),
      hands: newHands
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
      })
    }

    document.getElementById(`person-${turn}`).classList.remove("highlight-person")

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
    let activeHand = this.state.hands[turn]
    let potentialMoves = activeHand.filter(card => this.checkValidMove(card))
    while (potentialMoves.length === 0) {
      this.drawCard(turn)
      potentialMoves = activeHand.filter(card => this.checkValidMove(card))
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
     let promise = MySwal.fire({
       title:"Sort by",
       input: 'radio',
       inputOptions: ["Number", "Color"]
     })
     promise.then((res)=>{
       let array = ["number", "color"]
       this.sortBy(this.state.hands[0].cards,array[res.value])
       this.setState({})
     })

  }
  sortBy(array, sortBy){
    array.sort(function(a,b) {
      return ((a[sortBy] < b[sortBy]) ? -1 : ((a[sortBy] > b[sortBy]) ? 1 : 0));
    })
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
              hand={this.state.hands[1]}
              name={this.state.players[1].name}
            />
            </div>
          <div className="item2" id={`person-${2}`}>
            <div className="name">{this.state.players[2].name}</div>
            <CompHandContainer
              hand={this.state.hands[2]}
              name={this.state.players[2].name}
            />
          </div>
          <div className="item3" id={`person-${3}`}>
            <div className="name" >{this.state.players[3].name}</div>
            <CompHandContainer
              hand={this.state.hands[3]}
              name={this.state.players[3].name}
            />
          </div>
          <div className="item4">
            <GameDeckContainer
              handleDeckClick={this.drawCard}
              turn={this.state.turn}
              activeCard={this.state.activeCard}
              handleActiveCard={this.handleActiveCard}
              turnName={this.state.players[this.state.turn].player.name}
              fakerColor={this.state.fakeActiveCard}
            />
            <div className={"turn"}>Turn</div>
            <div className={"arrow"}>{(this.state.reversed)? "|   --->   |" : "|   <---   |"}</div>
          </div>
          <div className="item5" id={`person-${0}`}>
            <div className="name" >{this.state.players[0].name}</div>
            <UserHandContainer
              sortClick={this.sortClick}
              handleCardClick={this.handleCardClick}
              hand={this.state.hands[0]}
              name={this.state.players[0].name}
            />
            <button onClick={this.sortClick}>Sort Cards</button>

        </div>
        <div className="item6">
          <Save saveGame={this.saveGame}/>
        </div>
        <div className="item7">
          <Link to={`/games`}><button>All Games</button></Link>
        </div>
        <div className="item8">
          Good Luck
        </div>
      </div>
      :
      null
    )
  }

}

export default GameContainer
