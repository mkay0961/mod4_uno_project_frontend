import React, {Component} from 'react'
import UserHandContainer from './UserHandContainer'
import GameDeckContainer from './GameDeckContainer'
import CompHandContainer from './CompHandContainer'
import Save from '../components/Save'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import  {Link} from 'react-router-dom'
import DealCards from './DealCards'
import Speech from 'speak-tts'


const MySwal = withReactContent(Swal)
const speech = new Speech()

const url = () => 'http://localhost:3000/games/'

const insults = () => [
  "youre losing",
  "why are you so bad",
  "lol...",
  "you mad, bro?",
  "I hope you do better, I feel bad for you.",
  "I'm not even trying",
  "Ha ha ha ha ha.",
  "You stink. And you're bad at uno.",
  "Wanna hear a joke? Your uno skills.",
  "You probably use brackets as a text editor.",
  "I hope there's nothing left but cider at the beer tap",
  "It might sound crazy but it ain't no lie, bye bye bye",
  "Please wake up. You are in a coma, dreaming, and this is the only way we can try to reach you. We love you, we want you to come back to us."
]

class GameContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: null,
      allCards: [],
      reversed: false,
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
    let allCards = game.cards
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

    if (game.game_status === "Pending") {
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
      id: game.id,
      allCards: allCards,
      deck: deck,
      activeCard: activeCard,
      hands: [userHand, comp1Hand, comp2Hand, comp3Hand],
      players: players,
      gameStatus: game.game_status
    },()=>{this.saveGame()})

  }

  componentDidMount() {

    fetch( url()+this.props.gameId )
    .then( res => res.json() )
    .then(game => this.initGame(game) )
    this.compTurnInterval = setInterval(()=>{this.checkCompTurn()},1500)
    this.talkInterval = setInterval(()=>{this.insultPlayer()}, 5000)
    window.addEventListener('keydown', (e)=>{console.log(e.key);if (e.key === 'u'){this.cheat()}})
  }

  startGame = () => {
    this.setState({gameStatus: 'In Progress'})
  }

  insultPlayer = () => {
    let activeHand = this.state.hands[this.state.turn]
    if (activeHand.length < this.state.hands[0].length) {
      let insult = insults()[Math.floor(Math.random()*insults().length)]
      this.talk(insult)
    }
  }

  talk(text) {
    speech.speak({text})
  }

  cheat = () => {
    let newHands = [...this.state.hands]
    let activeHand = newHands[0]
    activeHand = activeHand.slice(activeHand.length - 1)
    newHands.splice(0, 1, activeHand)
    this.setState({hands: newHands})
  }

  checkCompTurn(){
    let turn = this.state.turn
    if(turn !== 0 && !this.state.paused && this.state.gameStatus === 'In Progress'){
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
      },()=>{
        clearInterval(this.compTurnInterval)
        clearInterval(this.talkInterval)
        this.saveGame()
        alert(`${activePlayer.name} IS THE WINNER`)
      })
    } else if (cardCount === 1 && this.state.turn !== 0) {
      this.talk('uno')
    }

  }

  shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5)
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

    if (newTurn === 0) {
      this.talk('get wrecked')
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
      default:

      }

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
    // document.getElementById(`person-${turn}`).classList.add("highlight-person")

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
//     setTimeout(()=>{document.getElementById(`person-${turn}`).classList.remove("highlight-person")
// },900)

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

  newGame = () => {
    let data = {}
    let promise = MySwal.fire({
      title:"Enter a Name",
      input: 'text',
      inputValidator: (value) => {
        if (!value) {
            return 'You need to choose something!'
          }
      }
    })
    promise.then((res)=>{data.name = res.value })

    promise.then(()=>{
    fetch("http://localhost:3000/games",{
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(json =>{
          this.props.history.push(`/games/${json.id}`)
        })
      })
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
       this.sortBy(this.state.hands[0], array[res.value])
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
    let cards = [...this.state.allCards]
    for (const i of cards) {
      if (this.state.hands[0].includes(i)) {
        i.game_position = 0
      } else if (this.state.hands[1].includes(i)) {
        i.game_position = 1
      } else if (this.state.hands[2].includes(i)) {
        i.game_position = 2
      } else if (this.state.hands[3].includes(i)) {
        i.game_position = 3
      } else if (this.state.activeCard === i) {
        i.game_position = 4
      } else {
        i.game_position = 5
      }
    }
    let data = {}
    data.id = this.state.id
    data.game_status = this.state.gameStatus
    data.winner = this.state.winner
    data.cards = cards
    // data.players = this.state.players
    // debugger
    fetch(url()+`${this.state.id}`,{
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
      (this.state.gameStatus !== 'Pending' )?
        <div className="grid-container">
          <div className="item1" id={`person-${1}`} >

            <div className="name" >{this.state.players[1].player.name}</div>
            <CompHandContainer
              person={"1"}
              hand={this.state.hands[1]}
              name={this.state.players[1].name}
            />
            </div>
          <div className="item2" id={`person-${2}`}>

            <div className="name">{this.state.players[2].player.name}</div>
            <CompHandContainer
              hand={this.state.hands[2]}
              name={this.state.players[2].name}
            />
          </div>
          <div className="item3" id={`person-${3}`}>
            <div className="name" >{this.state.players[3].player.name}</div>
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
            <div className={"arrow"}>{(this.state.reversed)? <i className="arrow right icon"></i>
            :
             <i className="arrow left icon"></i>}</div>
          </div>
          <div className="item5" id={`person-${0}`}>
            <div className="name" >{this.state.players[0].player.name}</div>
            <div className="scroll">
            <UserHandContainer
              sortClick={this.sortClick}
              handleCardClick={this.handleCardClick}
              hand={this.state.hands[0]}
              name={this.state.players[0].name}
            />
            </div>
            <button onClick={this.sortClick}>Sort Cards</button>
        </div>
        <div className="item6">
          <div className="ui buttons">
            <Link to={`/games`}><button onClick={this.saveGame}className="ui button">All Games</button></Link>
            <Save saveGame={this.saveGame}/>
          </div>
        </div>
      </div>
      :
      <DealCards startGame={this.startGame}/>
    )
  }

}

export default GameContainer
