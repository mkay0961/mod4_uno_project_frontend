
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
    console.log(this.state.turn);
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
    this.setState({
      turn: ((this.state.turn +1) % this.state.players.length)
    })
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


    // e.persist()
    // console.log("you clicked card", card);
    // console.log(this.cardlogic(card));
    // console.log((e === undefined)? "comp":"user")
    // if(this.state.turn == 0){
    //   if(this.cardlogic(card)){
    //     let newplayerhand = this.state.userhand
    //     newplayerhand = newplayerhand.filter((c)=>c!==card)
    //
    //     this.setState({
    //       deck: [this.state.active_card, ...this.state.deck],
    //       active_card: card,
    //       userhand: newplayerhand,
    //       turn: 1
    //     })
    //     setTimeout(this.drawcard, 1000)}
    //   }
    //   else if (this.state.turn === 0) {
    //     console.log("COMP TURN");
    //   }




  // compTurn = () => {
  //   let potentialMoves = this.state.comp1hand.filter(card => card.Number === this.state.active_card.Number || card.Color === this.state.active_card.Color)
  //
  //   while (potentialMoves.length === 0) {
  //     //drawcard
  //     if(this.state.deck.length > 0){
  //       let drawnCard = this.state.deck.pop()
  //       let updatedDeck = this.state.deck
  //       updatedDeck = updatedDeck.filter((c)=>c!==drawnCard)
  //
  //       //shuffle
  //       updatedDeck.sort(() => Math.random() - 0.5);
  //       updatedDeck.sort(() => Math.random() - 0.5);
  //
  //       this.setState({
  //         deck: updatedDeck,
  //         comp1hand: [...this.state.comp1hand, drawnCard]
  //       })
  //     }
  //     potentialMoves = this.state.comp1hand.filter(card => card.Number === this.state.active_card.Number || card.Color === this.state.active_card.Color)
  //   }
  //   let card = potentialMoves[0]
  //
  //   let newCompHand = this.state.comp1hand
  //   newCompHand = newCompHand.filter((c)=>c!==card)
  //   //random from that array
  //   //set that to top card
  //   this.setState({
  //     deck: [this.state.active_card, ...this.state.deck],
  //     active_card: card,
  //     comp1hand: newCompHand,
  //     turn: 0,
  //
  //   })
  //   //change turn
  //
  //
  //
  // }

  handleActiveCard = (card) =>{
    console.log("you clicked the active card", card);
  }
  // handleDeckClick = () =>{
  //   console.log(this.state.deck.length);
  //   if(this.state.deck.length > 0){
  //     let drawnCard = this.state.deck.pop()
  //     let updatedDeck = this.state.deck
  //     updatedDeck = updatedDeck.filter((c)=>c!==drawnCard)
  //
  //     //shuffle
  //     updatedDeck.sort(() => Math.random() - 0.5);
  //     updatedDeck.sort(() => Math.random() - 0.5);
  //
  //     this.setState({
  //       deck: updatedDeck,
  //       userhand: [...this.state.userhand, drawnCard]
  //     })
  //   }else{
  //     console.log("no more cards in deck");
  //   }
  // }

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
