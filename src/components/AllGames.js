import React, {Component} from 'react'
import  {Link} from 'react-router-dom'
import NewGame from './NewGame'
import GameContainer from '../containers/GameContainer'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

class AllGames extends Component {
  constructor(){
    super()
    this.state = {
      allGames: []
    }
  }
  componentDidMount(){
    setTimeout(()=>{
      fetch("http://localhost:3000/games")
      .then(res => res.json())
      .then(json => this.setState({allGames: json}))
    },1000)
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
    console.log("data")


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

  delGame(e){
    fetch(`http://localhost:3000/games/${e.target.parentElement.id.split("-")[1]}`,{
      method: "DELETE",
      headers: {
          "Content-Type": "application/json"
      }

      })
        .then(res => res.json())
        .then(json => this.setState({allGames:json},()=>{this.props.history.push(`/`)}))

  }

  render() {
    return(
    <div>
      <div className="allGames">All Games</div>
      <div className="newGame"><NewGame newGame={this.newGame} /></div>
      <div className="ui cards">
        {this.state.allGames.map((game)=>{
          return <div className="card gameCard" id={`game-${game.id}`}>
                    <Link to={`/games/${game.id}`}><button id="test"><GameContainer gameId={game.id}/></button></Link>
                    <button className="deleteGame" onClick={(e)=>{this.delGame(e)}}>Delete this game</button>
                  </div>
        })}
      </div>
    </div>
      )
  }

}

export default AllGames
